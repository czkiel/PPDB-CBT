import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Students from "./StudentModel.js";

const { DataTypes } = Sequelize;

// 1. BANK SOAL
export const Questions = db.define('questions', {
    question_text: { type: DataTypes.TEXT, allowNull: false },
    opt_a: { type: DataTypes.STRING, allowNull: false },
    opt_b: { type: DataTypes.STRING, allowNull: false },
    opt_c: { type: DataTypes.STRING, allowNull: false },
    opt_d: { type: DataTypes.STRING, allowNull: false },
    correct_answer: { type: DataTypes.ENUM('A', 'B', 'C', 'D'), allowNull: false }
}, { freezeTableName: true });

// 2. SESI UJIAN (Menyimpan timer dan skor)
export const ExamSessions = db.define('exam_sessions', {
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false }, // start_time + 45 menit
    is_finished: { type: DataTypes.BOOLEAN, defaultValue: false }, // True jika disubmit / waktu habis
    cbt_score: { type: DataTypes.FLOAT, defaultValue: 0 },
    studentId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Students, key: 'id' } }
}, { freezeTableName: true });

// 3. JAWABAN SISWA (Auto-save tiap nomor)
export const ExamAnswers = db.define('exam_answers', {
    selected_option: { type: DataTypes.ENUM('A', 'B', 'C', 'D'), allowNull: true },
    is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
    sessionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: ExamSessions, key: 'id' } },
    questionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Questions, key: 'id' } }
}, { freezeTableName: true });

// Relasi
Students.hasOne(ExamSessions, { foreignKey: 'studentId' });
ExamSessions.belongsTo(Students, { foreignKey: 'studentId' });

ExamSessions.hasMany(ExamAnswers, { foreignKey: 'sessionId' });
ExamAnswers.belongsTo(ExamSessions, { foreignKey: 'sessionId' });

Questions.hasMany(ExamAnswers, { foreignKey: 'questionId' });
ExamAnswers.belongsTo(Questions, { foreignKey: 'questionId' });