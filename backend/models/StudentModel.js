import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Students = db.define('students', {
    full_name: { type: DataTypes.STRING, allowNull: false },
    place_of_birth: { type: DataTypes.STRING, allowNull: true },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: true }, // DATEONLY karena cuma butuh tanggal
    gender: { 
        type: DataTypes.ENUM('Laki-laki', 'Perempuan'), 
        allowNull: true 
    },
    address: { type: DataTypes.TEXT, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    origin_school: { type: DataTypes.STRING, allowNull: true },
    
    // Data PPDB & Nilai
    report_score: { type: DataTypes.FLOAT, allowNull: true },
    verification_status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
    },
    graduation_status: {
        type: DataTypes.ENUM('waiting', 'passed', 'failed'),
        defaultValue: 'waiting'
    },
    
    // Foreign Key ke Users
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Users, key: 'id' }
    }
}, { freezeTableName: true });

// Relasi 1-to-1: Satu User punya Satu Student Profile
Users.hasOne(Students, { foreignKey: 'userId', onDelete: 'CASCADE' });
Students.belongsTo(Users, { foreignKey: 'userId' });

export default Students;