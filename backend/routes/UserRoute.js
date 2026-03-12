import express from "express";
import { RegisterSiswa } from "../controllers/Users.js";

const router = express.Router();

// Endpoint ini terbuka untuk umum (tanpa middleware verifyUser) agar siswa bisa daftar
router.post('/register', RegisterSiswa);

export default router;