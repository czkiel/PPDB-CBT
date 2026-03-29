"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { 
  LogOut, 
  MapPin, 
  AlertCircle, 
  FileText, 
  UploadCloud, 
  Laptop, 
  CheckCircle2, 
  Clock, 
  XOctagon, 
  ChevronRight, 
  GraduationCap, 
  Lock
} from "lucide-react";

export default function DashboardSiswa() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/me");
        // Tolak kalau yang login admin (amankan route)
        if (response.data.role !== "siswa") {
          router.push("/admin/dashboard");
        } else {
          setUser(response.data);
        }
      } catch (error) {
        // Kalau belum login, tendang ke halaman login
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.delete("/logout");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f5f0] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#c49a45] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-[#2b4d33] tracking-widest uppercase animate-pulse">Memuat Dasbor...</p>
      </div>
    );
  }

  // Ambil data siswa dari relasi database
  const studentData = user?.student || {};

  return (
    <div className="min-h-screen bg-[#f4f5f0] text-[#1a2e1f] font-sans pb-16 selection:bg-[#c49a45] selection:text-white">
      
      {/* NAVBAR DASBOR */}
      <nav className="bg-[#1a2e1f] text-white shadow-xl sticky top-0 z-50 border-b border-[#2b4d33]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Area */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#c49a45] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#c49a45] to-[#997734] rounded-full flex items-center justify-center font-black text-[#1a2e1f] border-2 border-[#1a2e1f] relative z-10 shadow-lg">
                  KW4
                </div>
              </div>
              <div>
                <span className="font-black text-lg block tracking-wide uppercase">Dasbor Siswa</span>
                <span className="text-xs text-[#a5baa9] hidden sm:block font-medium">Portal Penerimaan Calon Siswa Baru</span>
              </div>
            </div>

            {/* Profile & Action */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-white">Halo, {user?.name}</span>
                <span className="text-xs text-[#c49a45] font-semibold bg-[#2b4d33]/50 px-2 py-0.5 rounded-full mt-1">Calon Siswa</span>
              </div>
              <button 
                onClick={handleLogout}
                className="group flex items-center gap-2 bg-[#fdf3f4]/10 hover:bg-red-500/20 text-[#ff4d4f] hover:text-red-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* WELCOME BANNER & INFORMASI SEKOLAH */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.06)] overflow-hidden mb-10 border border-[#e3e8e5]">
          
          <div className="bg-[#2b4d33] px-8 sm:px-10 py-12 text-white relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-[#c49a45] rounded-full mix-blend-multiply blur-[80px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[10%] w-64 h-64 bg-[#4a7c59] rounded-full mix-blend-multiply blur-[60px] opacity-40"></div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#c49a45] animate-ping" />
                <span className="text-xs font-bold tracking-wider text-[#e8ebe3] uppercase">Tahun Ajaran 2024/2025</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                Selamat Datang, <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a5baa9]">{user?.name}!</span>
              </h1>
              <p className="text-[#a5baa9] text-lg font-medium">Selesaikan tahapan pendaftaran di bawah ini untuk mengikuti seleksi CBT.</p>
            </div>
          </div>
          
          <div className="p-8 sm:p-10 bg-white">
            <h2 className="text-sm font-bold tracking-widest text-[#c49a45] uppercase mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Info Sekolah
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#f4f5f0]/50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-[#2b4d33] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1a2e1f] uppercase mb-2">SMP Kartika Wirabuana 4</h3>
                  <p className="text-[#4b5e51] font-medium leading-relaxed text-sm">
                    Jl. 14 Februari No.100, Teling Bawah, Kec. Wenang, Kota Manado, Sulawesi Utara
                  </p>
                </div>
              </div>
              
              <div className="bg-[#fdf8ed] p-6 rounded-2xl border border-[#c49a45]/20 flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-[#c49a45] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a2e1f] mb-2 uppercase">Pengumuman Penting</h4>
                  <ul className="text-sm text-[#4b5e51] space-y-2 font-medium">
                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#c49a45] flex-shrink-0" /> Pastikan seluruh berkas pendaftaran telah diunggah.</li>
                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#c49a45] flex-shrink-0" /> CBT hanya dapat diakses setelah berkas diverifikasi.</li>
                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#c49a45] flex-shrink-0" /> Pantau terus status kelulusan di dasbor ini.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID SECTION: FORMULIR & UJIAN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CARD 1: DATA & BERKAS PENDAFTARAN */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border-t-4 border-[#2b4d33] flex flex-col group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-[#f4f5f0] text-[#2b4d33] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2b4d33] group-hover:text-white transition-colors duration-300 shadow-sm">
               <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1a2e1f] mb-3 uppercase">Pemberkasan</h2>
            <p className="text-[#4b5e51] mb-8 font-medium flex-1">
              Lengkapi dokumen persyaratan (Ijazah, SKL, KK, Akta Kelahiran) agar pendaftaran dapat segera diverifikasi oleh tim penilai.
            </p>
            
            <div className="bg-[#f4f5f0] p-5 rounded-2xl mb-8 space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-[#4b5e51]">Status Verifikasi:</span>
                {studentData.verification_status === "verified" && (
                  <span className="bg-[#d4edda] text-[#155724] text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Terverifikasi</span>
                )}
                {studentData.verification_status === "pending" && (
                  <span className="bg-[#fff3cd] text-[#856404] text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Menunggu</span>
                )}
                {studentData.verification_status === "rejected" && (
                  <span className="bg-[#f8d7da] text-[#721c24] text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"><XOctagon className="w-3.5 h-3.5"/> Ditolak / Perbaiki</span>
                )}
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-[#4b5e51] font-medium">Nilai Rapor Terdaftar:</span>
                <span className="text-lg font-black text-[#1a2e1f]">{studentData.report_score || "0.00"}</span>
              </div>
            </div>

            <Link href="/dashboard/berkas" className="group/btn w-full text-center bg-white border-2 border-[#2b4d33] hover:bg-[#2b4d33] text-[#2b4d33] hover:text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide">
              <UploadCloud className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
              Kelola Berkas
            </Link>
          </div>

          {/* CARD 2: UJIAN ONLINE (CBT) */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border-t-4 border-[#c49a45] flex flex-col group hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-[#fdf8ed] text-[#c49a45] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#c49a45] group-hover:text-white transition-colors duration-300 shadow-sm">
              <Laptop className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1a2e1f] mb-3 uppercase">Tes Ujian (CBT)</h2>
            <p className="text-[#4b5e51] mb-8 font-medium flex-1">
              Ujian masuk berbasis komputer. Siapkan koneksi internet yang stabil. Ujian akan memakan waktu tepat 45 Menit.
            </p>
            
            <div className="bg-[#f4f5f0] p-5 rounded-2xl mb-8">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-[#4b5e51]">Hasil Akhir:</span>
                {studentData.graduation_status === "passed" && (
                  <span className="bg-[#d4edda] text-[#155724] text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> LULUS</span>
                )}
                {studentData.graduation_status === "failed" && (
                  <span className="bg-[#f8d7da] text-[#721c24] text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"><XOctagon className="w-3.5 h-3.5"/> TIDAK LULUS</span>
                )}
                {studentData.graduation_status === "waiting" && (
                  <span className="bg-[#e2e3e5] text-[#383d41] text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Proses Penilaian</span>
                )}
              </div>
            </div>

            {studentData.verification_status === "verified" ? (
              <Link href="/dashboard/ujian" className="group/btn relative w-full flex justify-center items-center gap-2 py-4 px-4 text-base font-bold rounded-xl text-[#1a2e1f] bg-[#c49a45] hover:bg-[#d4a853] shadow-[0_8px_20px_rgba(196,154,69,0.3)] hover:shadow-[0_12px_25px_rgba(196,154,69,0.4)] transition-all duration-300 uppercase tracking-widest overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                <span>Mulai Ujian</span>
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button disabled className="w-full bg-[#f4f5f0] text-[#a5baa9] border-2 border-[#e3e8e5] font-bold py-4 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide">
                <Lock className="w-5 h-5" />
                Terkunci
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}