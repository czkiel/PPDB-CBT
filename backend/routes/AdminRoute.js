import express from "express";
import { getAllStudents, updateStudentStatus } from "../controllers/Admin.js";
import { verifyUser, adminOnly } from "../middleware/auth-middleware.js";

const router = express.Router();

// Wajib login dan WAJIB ADMIN
router.get('/admin/students', verifyUser, adminOnly, getAllStudents);
router.patch('/admin/students/:id', verifyUser, adminOnly, updateStudentStatus);

export default router;