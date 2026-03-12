"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch semua siswa
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/admin/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fungsi Update Status (Verifikasi Berkas / Kelulusan)
  const updateStatus = async (id, field, value) => {
    try {
      await axios.patch(`/admin/students/${id}`, {
        [field]: value
      });
      fetchStudents(); 
    } catch (error) {
      alert("Gagal memperbarui status.");
    }
  };

  // ==========================================
  // FUNGSI EXPORT KE EXCEL
  // ==========================================
  const exportToExcel = () => {
    // 1. Siapkan data yang rapi untuk Excel
    const dataToExport = students.map((student, index) => {
      const cbtScore = student.exam_session?.cbt_score || 0;
      const reportScore = student.report_score || 0;
      const finalScore = (cbtScore * 0.6) + (reportScore * 0.4);

      return {
        "No": index + 1,
        "Nama Lengkap": student.full_name,
        "Email": student.user?.email || "-",
        "No. HP": student.phone || "-",
        "Asal Sekolah": student.origin_school,
        "Nilai Rapor (40%)": reportScore,
        "Skor CBT (60%)": student.exam_session?.is_finished ? cbtScore.toFixed(2) : "Belum Ujian",
        "Bobot Akhir": student.exam_session?.is_finished ? finalScore.toFixed(2) : "-",
        "Status Berkas": student.verification_status.toUpperCase(),
        "Status Kelulusan": student.graduation_status.toUpperCase()
      };
    });

    // 2. Buat Worksheet & Workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar");

    // 3. Download File
    XLSX.writeFile(workbook, `Data_Pendaftar_PPDB_${new Date().getTime()}.xlsx`);
  };

  // ==========================================
  // FUNGSI EXPORT KE PDF
  // ==========================================
  const exportToPDF = () => {
    const doc = new jsPDF('landscape'); // Kertas landscape agar muat banyak kolom
    
    // Judul Dokumen
    doc.setFontSize(18);
    doc.text("Laporan Data Pendaftar PPDB", 14, 22);
    doc.setFontSize(11);
    doc.text("SMP Kartika Wirabuana 4", 14, 30);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 36);

    // Siapkan Kolom & Baris untuk Tabel
    const tableColumn = ["No", "Nama Lengkap", "Asal Sekolah", "Nilai Rapor", "Skor CBT", "Bobot Akhir", "Kelulusan"];
    const tableRows = [];

    students.forEach((student, index) => {
      const cbtScore = student.exam_session?.cbt_score || 0;
      const reportScore = student.report_score || 0;
      const finalScore = student.exam_session?.is_finished ? ((cbtScore * 0.6) + (reportScore * 0.4)).toFixed(2) : "-";
      
      const studentData = [
        index + 1,
        student.full_name,
        student.origin_school,
        reportScore,
        student.exam_session?.is_finished ? cbtScore.toFixed(2) : "Belum",
        finalScore,
        student.graduation_status.toUpperCase()
      ];
      tableRows.push(studentData);
    });

    // Generate Tabel
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [26, 46, 31] } // Warna Hijau Army #1a2e1f
    });

    // Download File
    doc.save(`Laporan_PPDB_${new Date().getTime()}.pdf`);
  };

  if (isLoading) return <div className="animate-pulse text-center font-bold text-[#2b4d33] mt-20">Memuat Data Pendaftar...</div>;

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1a2e1f] mb-2 uppercase">Manajemen Pendaftar</h2>
          <p className="text-[#4b5e51] font-medium">Verifikasi berkas persyaratan, pantau nilai murni ujian, dan tentukan kelulusan calon siswa.</p>
        </div>
        
        {/* TOMBOL EXPORT */}
        <div className="flex gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-1"
          >
            📊 Export Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-1"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* STATISTIK CEPAT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
          <p className="text-sm font-bold text-gray-500">Total Pendaftar</p>
          <p className="text-3xl font-black text-[#1a2e1f]">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
          <p className="text-sm font-bold text-gray-500">Menunggu Verifikasi</p>
          <p className="text-3xl font-black text-[#1a2e1f]">{students.filter(s => s.verification_status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
          <p className="text-sm font-bold text-gray-500">Selesai Ujian CBT</p>
          <p className="text-3xl font-black text-[#1a2e1f]">{students.filter(s => s.exam_session?.is_finished).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
          <p className="text-sm font-bold text-gray-500">Lulus</p>
          <p className="text-3xl font-black text-[#1a2e1f]">{students.filter(s => s.graduation_status === 'passed').length}</p>
        </div>
      </div>

      {/* TABEL DATA SISWA */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#1a2e1f] text-white text-sm uppercase tracking-wider">
                <th className="p-4">Nama & Berkas</th>
                <th className="p-4">Asal Sekolah</th>
                <th className="p-4 text-center">Nilai Rapor</th>
                <th className="p-4 text-center">Skor CBT</th>
                <th className="p-4 text-center">Aksi Verifikasi</th>
                <th className="p-4 text-center">Aksi Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {students.map((student) => {
                const cbtScore = student.exam_session?.cbt_score || 0;
                const totalScore = (cbtScore * 0.6) + ((student.report_score || 0) * 0.4);

                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-[#1a2e1f] text-base">{student.full_name}</p>
                      <p className="text-xs text-gray-500 mb-2">{student.user?.email} | {student.phone || "-"}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {student.documents?.length > 0 ? (
                          student.documents.map((doc, index) => (
                            <a 
                              key={index}
                              href={doc.file_path} 
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-[#eef2ef] text-[#2b4d33] text-[10px] font-bold px-2 py-1 rounded border border-[#2b4d33] hover:bg-[#2b4d33] hover:text-white transition-colors"
                            >
                              {doc.doc_type.toUpperCase()}
                            </a>
                          ))
                        ) : (
                          <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded border border-red-200">Belum Ada Berkas</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4 text-[#4b5e51]">
                      <p className="font-medium">{student.origin_school}</p>
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className="font-black text-blue-600 text-lg bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        {student.report_score}
                      </span>
                    </td>
                    
                    <td className="p-4 text-center">
                      {student.exam_session?.is_finished ? (
                        <div>
                          <p className="font-black text-purple-600 text-lg bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 mb-1">
                            {cbtScore.toFixed(1)}
                          </p>
                          <p className="text-[10px] font-bold text-gray-500">Bobot: {totalScore.toFixed(1)}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Belum Ujian</span>
                      )}
                    </td>
                    
                    <td className="p-4 text-center">
                      <select 
                        value={student.verification_status}
                        onChange={(e) => updateStatus(student.id, 'verification_status', e.target.value)}
                        className={`text-xs font-bold rounded-lg px-3 py-2 outline-none border cursor-pointer w-full max-w-[140px] shadow-sm ${
                          student.verification_status === 'verified' ? 'bg-green-100 text-green-800 border-green-300' :
                          student.verification_status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                          'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="verified">✅ Verified (Buka CBT)</option>
                        <option value="rejected">❌ Tolak Berkas</option>
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <select 
                        value={student.graduation_status}
                        onChange={(e) => updateStatus(student.id, 'graduation_status', e.target.value)}
                        className={`text-xs font-bold rounded-lg px-3 py-2 outline-none border cursor-pointer w-full max-w-[140px] shadow-sm ${
                          student.graduation_status === 'passed' ? 'bg-green-100 text-green-800 border-green-300' :
                          student.graduation_status === 'failed' ? 'bg-red-100 text-red-800 border-red-300' :
                          'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                        disabled={!student.exam_session?.is_finished}
                        title={!student.exam_session?.is_finished ? "Siswa belum menyelesaikan CBT" : ""}
                      >
                        <option value="waiting">Menunggu</option>
                        <option value="passed">LULUSKAN 🎉</option>
                        <option value="failed">TIDAK LULUS ❌</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-medium text-lg">
                    Belum ada data pendaftar masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}