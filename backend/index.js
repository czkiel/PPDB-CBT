import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import db from "./config/database.js";

// Import Semua Model
import Users from "./models/UserModel.js";
import Students from "./models/StudentModel.js";
import Parents from "./models/ParentModel.js";
import Documents from "./models/DocumentModel.js";
import { Questions, ExamSessions, ExamAnswers } from "./models/ExamModel.js";

// Import Routers
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import DocumentRoute from "./routes/DocumentRoute.js";
import QuestionRoute from "./routes/QuestionRoute.js";
import ExamRoute from "./routes/ExamRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import { initializeExamAutoSubmit } from "./controllers/Exams.js";

dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

// Gunakan Routes
app.use(AuthRoute);
app.use(UserRoute);
app.use(DocumentRoute);
app.use(QuestionRoute);
app.use(ExamRoute);
app.use(AdminRoute);

// Sync Database
// (async () => {
//     try {
//         await db.authenticate();
//         console.log("✅ Database Connected to Laragon!");
//         // Alter true otomatis menambah tabel/kolom baru tanpa menghapus data lama
//         await db.sync({ alter: true }); 
//         console.log("✅ Database Synced & Updated!");
//     } catch (error) {
//         console.error("❌ DB Connection Failed:", error);
//     }
// })();

(async () => {
    await db.sync();
    await initializeExamAutoSubmit();
})();

app.get('/', (req, res) => {
    res.json({ msg: "API PPDB & CBT Militer Ready!" });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`🚀 Server running on port ${process.env.APP_PORT}`);
});