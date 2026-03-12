import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Students from "./StudentModel.js";

const { DataTypes } = Sequelize;

// Tabel untuk menyimpan berkas Ijazah, SKL, KK, Akte
const Documents = db.define('documents', {
    doc_type: {
        type: DataTypes.ENUM('ijazah', 'skl', 'kk', 'akte'),
        allowNull: false,
    },
    file_path: {
        type: DataTypes.STRING, // Path ke gambar/pdf
        allowNull: false,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Students, key: 'id' }
    }
}, { freezeTableName: true });

Students.hasMany(Documents, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Documents.belongsTo(Students, { foreignKey: 'studentId' });

export default Documents;