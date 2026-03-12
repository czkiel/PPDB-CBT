import Users from "../models/UserModel.js";
import Students from "../models/StudentModel.js";
import Parents from "../models/ParentModel.js";
import bcrypt from "bcrypt";
import db from "../config/database.js";

// Fungsi Registrasi Siswa Baru (PPDB)
export const RegisterSiswa = async (req, res) => {
    const { 
        // Data Akun
        name, email, password, confPassword,
        // Data Siswa
        place_of_birth, date_of_birth, gender, address, phone, origin_school, report_score,
        // Data Orang Tua
        parent_name, parent_place_of_birth, parent_date_of_birth, parent_phone, 
        parent_email, occupation, relationship
    } = req.body;

    // Validasi Password
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok!"});

    // Cek Email apakah sudah terdaftar
    const existingUser = await Users.findOne({ where: { email: email } });
    if(existingUser) return res.status(400).json({msg: "Email sudah terdaftar!"});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Mulai Database Transaction 
    const t = await db.transaction();

    try {
        // 1. Buat Akun User
        const newUser = await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "siswa"
        }, { transaction: t });

        // 2. Buat Profil Siswa
        await Students.create({
            full_name: name,
            place_of_birth: place_of_birth,
            date_of_birth: date_of_birth,
            gender: gender,
            address: address,
            phone: phone,
            origin_school: origin_school,
            report_score: report_score || 0,
            userId: newUser.id
        }, { transaction: t });

        // 3. Buat Profil Orang Tua
        await Parents.create({
            parent_name: parent_name,
            place_of_birth: parent_place_of_birth,
            date_of_birth: parent_date_of_birth,
            phone: parent_phone,
            personal_email: parent_email,
            occupation: occupation,
            relationship: relationship,
            userId: newUser.id
        }, { transaction: t });

        // Jika semua sukses, Commit Transaksi
        await t.commit();
        res.status(201).json({msg: "Pendaftaran Berhasil! Silakan Login."});

    } catch (error) {
        // Jika gagal, batalkan semua (Rollback)
        await t.rollback();
        res.status(500).json({msg: error.message});
    }
}