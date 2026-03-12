import Students from "../models/StudentModel.js";
import Users from "../models/UserModel.js";
import Documents from "../models/DocumentModel.js";
import { ExamSessions } from "../models/ExamModel.js";

// Ambil Semua Data Calon Siswa beserta Dokumen dan Nilai Ujiannya
export const getAllStudents = async (req, res) => {
    try {
        const students = await Students.findAll({
            include: [
                { model: Users, attributes: ['name', 'email'] },
                { model: Documents, attributes: ['doc_type', 'file_path'] },
                { model: ExamSessions, attributes: ['cbt_score', 'is_finished'] }
            ],
            order: [['createdAt', 'DESC']] // Urutkan dari pendaftar terbaru
        });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Update Status Verifikasi (Buka gembok ujian) & Kelulusan
export const updateStudentStatus = async (req, res) => {
    const { verification_status, graduation_status } = req.body;
    try {
        const student = await Students.findOne({ where: { id: req.params.id } });
        if (!student) return res.status(404).json({msg: "Siswa tidak ditemukan"});

        await Students.update({
            verification_status: verification_status || student.verification_status,
            graduation_status: graduation_status || student.graduation_status
        }, { 
            where: { id: student.id } 
        });

        res.status(200).json({msg: "Status siswa berhasil diperbarui!"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}