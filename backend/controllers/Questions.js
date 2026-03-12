import { Questions } from "../models/ExamModel.js";

// Ambil semua soal
export const getQuestions = async (req, res) => {
    try {
        const response = await Questions.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Tambah Soal Baru (Khusus Admin)
export const createQuestion = async (req, res) => {
    const { question_text, opt_a, opt_b, opt_c, opt_d, correct_answer } = req.body;
    try {
        await Questions.create({
            question_text: question_text,
            opt_a: opt_a,
            opt_b: opt_b,
            opt_c: opt_c,
            opt_d: opt_d,
            correct_answer: correct_answer.toUpperCase() // Pastikan selalu A, B, C, atau D
        });
        res.status(201).json({msg: "Soal berhasil ditambahkan ke Bank Soal!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Hapus Soal
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Questions.findOne({ where: { id: req.params.id } });
        if(!question) return res.status(404).json({msg: "Soal tidak ditemukan"});

        await Questions.destroy({ where: { id: question.id } });
        res.status(200).json({msg: "Soal berhasil dihapus!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}