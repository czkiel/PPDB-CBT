import express from "express";
import { startExam, saveAnswer, finishExam } from "../controllers/Exams.js";
import { verifyUser } from "../middleware/auth-middleware.js";

const router = express.Router();

// Siswa akses ujian
router.get('/exam/start', verifyUser, startExam);
router.post('/exam/answer', verifyUser, saveAnswer);
router.post('/exam/finish', verifyUser, finishExam);

export default router;