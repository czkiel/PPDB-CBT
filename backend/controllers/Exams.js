import { ExamSessions, ExamAnswers, Questions } from "../models/ExamModel.js";
import Students from "../models/StudentModel.js";
import db from "../config/database.js";

const scheduledSessionTimeouts = new Map();

const createSeed = (...values) => {
    let seed = 0;
    for (const value of values) {
        seed = ((seed * 1664525) + (Number(value) || 0) + 1013904223) >>> 0;
    }
    return seed;
};

const seededRandom = (seed) => {
    let currentSeed = seed >>> 0;
    return () => {
        currentSeed = (currentSeed * 1664525 + 1013904223) >>> 0;
        return currentSeed / 4294967296;
    };
};

const deterministicShuffle = (items, seed) => {
    const shuffled = [...items];
    const random = seededRandom(seed);

    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
};

const buildQuestionPayload = (answer) => {
    const payload = answer.get ? answer.get({ plain: true }) : answer;
    const question = payload.question;
    const optionSeed = createSeed(payload.id, payload.sessionId, payload.questionId);

    const options = deterministicShuffle([
        { key: 'A', text: question.opt_a },
        { key: 'B', text: question.opt_b },
        { key: 'C', text: question.opt_c },
        { key: 'D', text: question.opt_d }
    ], optionSeed);

    return {
        ...payload,
        question: {
            ...question,
            options
        }
    };
};

const clearScheduledAutoFinish = (sessionId) => {
    const existingTimeout = scheduledSessionTimeouts.get(sessionId);
    if (existingTimeout) {
        clearTimeout(existingTimeout);
        scheduledSessionTimeouts.delete(sessionId);
    }
};

const finalizeSession = async (session) => {
    if (!session || session.is_finished) {
        return session;
    }

    const totalQuestions = await ExamAnswers.count({ where: { sessionId: session.id } });
    const correctAnswers = await ExamAnswers.count({ where: { sessionId: session.id, is_correct: true } });

    let finalScore = 0;
    if (totalQuestions > 0) {
        finalScore = (correctAnswers / totalQuestions) * 100;
    }

    await ExamSessions.update(
        { is_finished: true, cbt_score: finalScore },
        { where: { id: session.id } }
    );

    clearScheduledAutoFinish(session.id);
    session.is_finished = true;
    session.cbt_score = finalScore;

    return session;
};

const scheduleSessionAutoFinish = (session) => {
    if (!session || session.is_finished) {
        return;
    }

    clearScheduledAutoFinish(session.id);

    const delay = new Date(session.end_time).getTime() - Date.now();
    if (delay <= 0) {
        finalizeSession(session).catch((error) => {
            console.error(`Gagal auto-submit sesi ${session.id}:`, error.message);
        });
        return;
    }

    const timeoutId = setTimeout(() => {
        finalizeSession(session).catch((error) => {
            console.error(`Gagal auto-submit sesi ${session.id}:`, error.message);
        });
    }, delay);

    scheduledSessionTimeouts.set(session.id, timeoutId);
};

export const initializeExamAutoSubmit = async () => {
    const activeSessions = await ExamSessions.findAll({ where: { is_finished: false } });
    activeSessions.forEach(scheduleSessionAutoFinish);
};

// FUNGSI 1: MULAI UJIAN ATAU RESUME UJIAN
export const startExam = async (req, res) => {
    try {
        // 1. Cari data siswa
        const student = await Students.findOne({ where: { userId: req.userId } });
        if (!student) return res.status(404).json({msg: "Data siswa tidak ditemukan!"});

        // Cek apakah akun sudah di-verifikasi Admin
        if(student.verification_status !== 'verified') {
            return res.status(403).json({msg: "Akun Anda belum diverifikasi oleh panitia. Tidak dapat memulai ujian."});
        }

        // 2. Cek apakah sudah punya sesi ujian sebelumnya
        let session = await ExamSessions.findOne({ where: { studentId: student.id } });

        // JIKA SUDAH PUNYA SESI (RESUME)
        if (session) {
            if (session.is_finished) return res.status(403).json({msg: "Anda sudah menyelesaikan ujian ini."});
            scheduleSessionAutoFinish(session);
            
            // Cek apakah waktu sudah habis secara server-side
            if (new Date() > new Date(session.end_time)) {
                await finalizeSession(session);
                return res.status(403).json({msg: "Waktu ujian Anda telah habis. Sistem telah otomatis mengumpulkan jawaban Anda."});
            }

            // Ambil soal ujian yang SUDAH DIACAK untuk anak ini sebelumnya
            const answers = await ExamAnswers.findAll({
                where: { sessionId: session.id },
                include: [{ model: Questions, attributes: ['id', 'question_text', 'opt_a', 'opt_b', 'opt_c', 'opt_d'] }],
                order: [['id', 'ASC']] // Pastikan urutannya tetap sama seperti saat pertama kali diacak
            });

            return res.status(200).json({
                msg: "Resume Ujian",
                session_id: session.id,
                end_time: session.end_time,
                questions: answers.map(buildQuestionPayload)
            });
        }

        // JIKA BELUM PUNYA SESI (UJIAN BARU)
        const t = await db.transaction();
        
        // Buat waktu mulai dan waktu selesai (45 Menit)
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 45 * 60000); 

        const newSession = await ExamSessions.create({
            start_time: startTime,
            end_time: endTime,
            studentId: student.id
        }, { transaction: t });

        // Ambil semua soal dari bank soal
        let allQuestions = await Questions.findAll({ transaction: t });
        
        // LOGIKA ACAK SOAL (Fisher-Yates Shuffle)
        for (let i = allQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }

        // Simpan urutan acak ini ke tabel ExamAnswers (dengan jawaban kosong / null)
        const emptyAnswers = allQuestions.map(q => ({
            selected_option: null,
            is_correct: false,
            sessionId: newSession.id,
            questionId: q.id
        }));

        await ExamAnswers.bulkCreate(emptyAnswers, { transaction: t });
        await t.commit();

        // Ambil kembali data yang sudah di-generate untuk dikirim ke Frontend
        const savedAnswers = await ExamAnswers.findAll({
            where: { sessionId: newSession.id },
            include: [{ model: Questions, attributes: ['id', 'question_text', 'opt_a', 'opt_b', 'opt_c', 'opt_d'] }],
            order: [['id', 'ASC']]
        });

        scheduleSessionAutoFinish(newSession);

        res.status(200).json({
            msg: "Ujian Dimulai",
            session_id: newSession.id,
            end_time: newSession.end_time,
            questions: savedAnswers.map(buildQuestionPayload)
        });

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// FUNGSI 2: AUTO-SAVE JAWABAN PER NOMOR
export const saveAnswer = async (req, res) => {
    const { answerId, selected_option } = req.body; 

    try {
        const student = await Students.findOne({ where: { userId: req.userId } });
        if (!student) return res.status(404).json({msg: "Data siswa tidak ditemukan!"});

        const answer = await ExamAnswers.findOne({
            where: { id: answerId },
            include: [{ model: ExamSessions }, { model: Questions }]
        });

        if (!answer) return res.status(404).json({msg: "Data soal tidak valid"});
        
        // Cek Keamanan: Apakah waktu sudah habis atau sudah disubmit?
        const session = answer.exam_session;
        if (session.studentId !== student.id) {
            return res.status(403).json({msg: "Anda tidak berhak mengubah jawaban sesi ini."});
        }

        if (session.is_finished) return res.status(403).json({msg: "Ujian sudah ditutup!"});
        if (new Date() > new Date(session.end_time)) {
            await finalizeSession(session);
            return res.status(403).json({msg: "Waktu ujian telah habis! Jawaban Anda telah otomatis dikumpulkan."});
        }

        // Tentukan apakah jawaban benar
        const isCorrect = (selected_option === answer.question.correct_answer);

        await ExamAnswers.update(
            { selected_option: selected_option, is_correct: isCorrect },
            { where: { id: answerId } }
        );

        res.status(200).json({msg: "Tersimpan"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// FUNGSI 3: SUBMIT UJIAN & HITUNG NILAI
export const finishExam = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const student = await Students.findOne({ where: { userId: req.userId } });
        if (!student) return res.status(404).json({msg: "Data siswa tidak ditemukan!"});

        const session = await ExamSessions.findOne({ where: { id: sessionId, studentId: student.id } });
        if (!session) return res.status(404).json({msg: "Sesi tidak ditemukan"});
        if (session.is_finished) return res.status(400).json({msg: "Ujian sudah disubmit sebelumnya."});

        await finalizeSession(session);

        res.status(200).json({msg: "Ujian Selesai! Jawaban telah disubmit dengan aman."});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}