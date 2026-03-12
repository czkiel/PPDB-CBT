import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Parents = db.define('parents', {
    parent_name: { type: DataTypes.STRING, allowNull: false },
    place_of_birth: { type: DataTypes.STRING, allowNull: true },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    personal_email: { type: DataTypes.STRING, allowNull: true },
    occupation: { type: DataTypes.STRING, allowNull: true },
    relationship: { 
        type: DataTypes.ENUM('Ayah', 'Ibu', 'Wali'), 
        allowNull: false 
    },
    
    // Foreign Key ke Users (Karna mereka login pake 1 akun yg sama dengan siswa)
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Users, key: 'id' }
    }
}, { freezeTableName: true });

// Relasi 1-to-1: Satu User juga punya Satu Parent Profile
Users.hasOne(Parents, { foreignKey: 'userId', onDelete: 'CASCADE' });
Parents.belongsTo(Users, { foreignKey: 'userId' });

export default Parents;