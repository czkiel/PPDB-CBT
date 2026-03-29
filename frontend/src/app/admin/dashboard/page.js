"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Users, FileCheck, Award, FileSpreadsheet, Search, Clock, XSquare } from "lucide-react";

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
    autoTable(doc, {
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

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border h-28"></div>
        ))}
      </div>
      <div className="h-64 bg-white rounded-3xl shadow-sm border border-gray-100"></div>
    </div>
  );

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1a2e1f] mb-1 uppercase tracking-tight">Manajemen Pendaftar</h2>
          <p className="text-[#4b5e51] font-medium text-sm md:text-base">Verifikasi berkas persyaratan, pantau nilai ujian, dan tentukan kelulusan calon siswa.</p>
        </div>
        
        {/* EXPORT BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <FileSpreadsheet size={18} /> Export Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-rose-500/20 transition-all transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Users size={100} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pendaftar</p>
          <p className="text-4xl font-black text-[#1a2e1f]">{students.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-amber-500">
             <Clock size={100} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Menunggu Verifikasi</p>
          <p className="text-4xl font-black text-amber-600">{students.filter(s => s.verification_status === 'pending').length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-500">
             <FileCheck size={100} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Selesai Ujian CBT</p>
          <p className="text-4xl font-black text-blue-600">{students.filter(s => s.exam_session?.is_finished).length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500">
             <Award size={100} />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Siswa Lulus</p>
          <p className="text-4xl font-black text-emerald-600">{students.filter(s => s.graduation_status === 'passed').length}</p>
        </div>
      </div>

      {/* STUDENT TABLE AREA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative mt-8">
        <div className="overflow-x-auto ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-200 text-left w-full align-middle">
            <thead className="bg-[#1a2e1f]">
              <tr>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Info Pendaftar</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider">Asal Sekolah</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider text-center">Rapor</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider text-center">CBT Index</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider text-center">Status Berkas</th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-white uppercase tracking-wider text-center">Evaluasi Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm">
              {students.map((student) => {
                const cbtScore = student.exam_session?.cbt_score || 0;
                const totalScore = (cbtScore * 0.6) + ((student.report_score || 0) * 0.4);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 text-white bg-[#2b4d33] rounded-full flex items-center justify-center font-bold text-lg hidden sm:flex">
                           {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{student.full_name}</p>
                          <p className="text-xs text-gray-500 mb-2 truncate max-w-[200px]">{student.user?.email} &bull; {student.phone || "-"}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {student.documents?.length > 0 ? (
                              student.documents.map((doc, index) => (
                                <a 
                                  key={index}
                                  href={doc.file_path} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
                                >
                                  <FileCheck size={12} /> {doc.doc_type.toUpperCase()}
                                </a>
                              ))
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                                <XSquare size={12} /> Tanpa Berkas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                      <p className="font-medium text-sm truncate max-w-[150px]" title={student.origin_school}>{student.origin_school}</p>
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center h-8 px-3 rounded-full text-sm font-black text-sky-700 bg-sky-50 border border-sky-100 min-w-[50px]">
                        {student.report_score}
                      </span>
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      {student.exam_session?.is_finished ? (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex justify-center items-center h-8 px-3 rounded-full text-base font-black text-violet-700 bg-violet-50 border border-violet-100 min-w-[60px] mb-1">
                            {cbtScore.toFixed(1)}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">
                            Σ {totalScore.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium italic bg-gray-50 px-2 py-1 rounded">
                          <Clock size={12}/> Tertunda
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <select 
                        value={student.verification_status}
                        onChange={(e) => updateStatus(student.id, 'verification_status', e.target.value)}
                        className={`text-xs font-bold rounded-lg px-3 py-2 outline-none border cursor-pointer w-full max-w-[130px] transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 appearance-none text-center
                        ${student.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                          student.verification_status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="verified">✅ Verified (CBT)</option>
                        <option value="rejected">❌ Tolak</option>
                      </select>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <select 
                        value={student.graduation_status}
                        onChange={(e) => updateStatus(student.id, 'graduation_status', e.target.value)}
                        className={`text-xs font-bold rounded-lg px-3 py-2 outline-none border cursor-pointer w-full max-w-[130px] transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 appearance-none text-center
                        ${student.graduation_status === 'passed' ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' :
                          student.graduation_status === 'failed' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' :
                          'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        disabled={!student.exam_session?.is_finished}
                        title={!student.exam_session?.is_finished ? "Siswa belum menyelesaikan CBT" : ""}
                      >
                        <option value="waiting">Menunggu</option>
                        <option value="passed">🌟 LULUS</option>
                        <option value="failed">❌ GAGAL</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                     <div className="flex flex-col items-center justify-center gap-3">
                        <Search size={40} className="text-gray-300" />
                        <p className="font-medium text-base">Belum ada data pendaftar masuk.</p>
                        <p className="text-sm">Data calon siswa akan muncul secara otomatis di sini.</p>
                     </div>
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