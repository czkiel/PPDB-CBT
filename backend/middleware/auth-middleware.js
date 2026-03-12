import Users from "../models/UserModel.js";

// Middleware untuk mengecek apakah user sudah login
export const verifyUser = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda terlebih dahulu!"});
    }
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    
    // Simpan id dan role ke request untuk dipakai di controller selanjutnya
    req.userId = user.id;
    req.role = user.role; 
    next();
}

// Middleware untuk membatasi akses khusus Admin
export const adminOnly = async (req, res, next) => {
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    if(user.role !== "admin") return res.status(403).json({msg: "Akses terlarang! Anda bukan admin."});
    next();
}