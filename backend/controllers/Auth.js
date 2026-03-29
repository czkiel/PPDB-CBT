import Users from "../models/UserModel.js";
import Students from "../models/StudentModel.js";
import Parents from "../models/ParentModel.js";
import bcrypt from "bcrypt";

const getAnnouncementState = () => {
    const configuredDate = process.env.ANNOUNCEMENT_DATE;

    if (!configuredDate) {
        return {
            date: null,
            isOpen: true
        };
    }

    const announcementDate = new Date(configuredDate);
    if (Number.isNaN(announcementDate.getTime())) {
        return {
            date: configuredDate,
            isOpen: true
        };
    }

    return {
        date: announcementDate.toISOString(),
        isOpen: Date.now() >= announcementDate.getTime()
    };
};

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { email: req.body.email } });
        if(!user) return res.status(404).json({msg: "Email tidak ditemukan!"});

        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg: "Password salah!"});

        // Simpan UUID user ke Session
        req.session.userId = user.uuid;

        res.status(200).json({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const Me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon login ke akun Anda!"});
    }
    
    try {
        const user = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: { uuid: req.session.userId },
            include: [
                { model: Students }, 
                { model: Parents }
            ]
        });
        
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        const userProfile = user.toJSON();
        res.status(200).json({
            ...userProfile,
            announcement: getAnnouncementState()
        });
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const Logout = async (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah logout"});
    });
}