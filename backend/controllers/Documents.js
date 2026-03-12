import Documents from "../models/DocumentModel.js";
import Students from "../models/StudentModel.js";
import path from "path";
import fs from "fs";

export const uploadDocuments = async (req, res) => {
    // 1. Cek apakah ada file yang dikirim
    if (!req.files) return res.status(400).json({msg: "Tidak ada file yang diupload!"});

    try {
        // 2. Cari ID siswa berdasarkan User yang sedang login
        const student = await Students.findOne({ where: { userId: req.userId } });
        if(!student) return res.status(404).json({msg: "Data profil siswa tidak ditemukan!"});

        const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf'];
        const maxSize = 5000000; // 5 MB

        // Kita tambahkan 'ijasah' (pakai S) sebagai alias biar kebal dari typo di Frontend/Postman
        const docTypes = ['ijazah', 'ijasah', 'skl', 'kk', 'akte'];
        let uploadedCount = 0;

        // Bikin folder documents otomatis kalau belum ada
        const dir = './public/documents';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        // 3. Looping untuk mengecek dan menyimpan setiap file yang diupload
        for (const type of docTypes) {
            const file = req.files[`file_${type}`];
            
            if (file) {
                const ext = path.extname(file.name).toLowerCase();
                
                // Validasi ekstensi & ukuran
                if(!allowedTypes.includes(ext)) return res.status(422).json({msg: `Tipe file ${type} harus berupa JPG, PNG, atau PDF`});
                if(file.size > maxSize) return res.status(422).json({msg: `Ukuran file ${type} maksimal 5MB`});

                // Standardisasi nama: Kalau yang dikirim 'ijasah', kita ubah jadi 'ijazah' di database biar seragam
                const standardizedType = type === 'ijasah' ? 'ijazah' : type;

                // Penamaan file agar tidak bentrok (Format: IDsiswa_Tipe_Timestamp.ext)
                const fileName = `${student.id}_${standardizedType}_${Date.now()}${ext}`;
                const url = `${req.protocol}://${req.get("host")}/documents/${fileName}`;
                const uploadPath = `./public/documents/${fileName}`;

                // Pindahkan file ke folder public/documents (Gunakan AWAIT agar sinkron)
                await file.mv(uploadPath);

                // Cek apakah siswa sudah pernah upload dokumen tipe ini sebelumnya
                const existingDoc = await Documents.findOne({
                    where: { studentId: student.id, doc_type: standardizedType }
                });

                if(existingDoc) {
                    // Kalau sudah ada, hapus file lama di folder biar storage gak penuh
                    const oldPath = `./public/documents/${path.basename(existingDoc.file_path)}`;
                    if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                    
                    // Update URL di database
                    await Documents.update({ file_path: url }, { where: { id: existingDoc.id } });
                } else {
                    // Kalau belum ada, Create baru
                    await Documents.create({
                        doc_type: standardizedType,
                        file_path: url,
                        studentId: student.id
                    });
                }
                uploadedCount++;
            }
        }

        if(uploadedCount === 0) return res.status(400).json({msg: "Harap pilih minimal 1 file dokumen yang valid (file_ijazah, file_kk, dll)."});

        res.status(200).json({msg: `${uploadedCount} Dokumen berhasil diunggah dan disimpan!`});

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Fungsi untuk menarik data dokumen (Khusus admin atau siswa yang bersangkutan)
export const getDocuments = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            // Admin bisa lihat semua dokumen
            response = await Documents.findAll({
                include: [{ model: Students, attributes: ['full_name', 'nisn'] }]
            });
        } else {
            // Siswa hanya bisa lihat dokumen miliknya sendiri
            const student = await Students.findOne({ where: { userId: req.userId } });
            response = await Documents.findAll({
                where: { studentId: student.id }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}