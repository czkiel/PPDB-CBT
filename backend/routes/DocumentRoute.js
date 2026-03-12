import express from "express";
import { uploadDocuments, getDocuments } from "../controllers/Documents.js";
import { verifyUser } from "../middleware/auth-middleware.js";

const router = express.Router();

// Wajib login (verifyUser) untuk bisa upload dan lihat dokumen
router.post('/upload-documents', verifyUser, uploadDocuments);
router.get('/documents', verifyUser, getDocuments);

export default router;