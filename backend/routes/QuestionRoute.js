import express from "express";
import { getQuestions, createQuestion, deleteQuestion } from "../controllers/Questions.js";
import { verifyUser, adminOnly } from "../middleware/auth-middleware.js";

const router = express.Router();

// Hanya Admin yang bisa atur soal
router.get('/questions', verifyUser, adminOnly, getQuestions);
router.post('/questions', verifyUser, adminOnly, createQuestion);
router.delete('/questions/:id', verifyUser, adminOnly, deleteQuestion);

export default router;