"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";

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
      <div className="min-h-screen bg-[#e3e8e5] flex items-center justify-center">
        <p className="text-xl font-bold text-[#2b4d33] animate-pulse">Memuat Dasbor...</p>
      </div>
    );
  }

  // Ambil data siswa dari relasi database
  const studentData = user?.student || {};

  return (
    <div className="min-h-screen bg-[#e3e8e5] text-[#1a2e1f] font-sans pb-12">
      {/* NAVBAR DASBOR */}
      <nav className="bg-[#1a2e1f] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c49a45] rounded-full flex items-center justify-center font-black text-[#1a2e1f] border-2 border-white">
                KW4
              </div>
              <span className="font-bold text-lg hidden sm:block tracking-wide">Dasbor Calon Siswa</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#a5baa9] hidden md:block">Halo, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* WELCOME BANNER & INFORMASI SEKOLAH */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border-t-4 border-[#2b4d33]">
          <div className="bg-[#2b4d33] px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#c49a45] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 relative z-10">Selamat Datang, {user?.name}!</h1>
            <p className="text-[#a5baa9] text-lg relative z-10">Proses pendaftaran Anda sedang berlangsung.</p>
          </div>
          
          <div className="p-8 bg-white">
            <h2 className="text-xl font-bold text-[#1a2e1f] mb-4 border-b-2 border-[#e3e8e5] pb-2 inline-block">Informasi Sekolah</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-[#2b4d33] uppercase">SMP Kartika Wirabuana 4</h3>
                <p className="text-[#4b5e51] mt-2 font-medium leading-relaxed">
                  <span className="font-bold">Alamat:</span><br/>
                  Jl. 14 Februari No.100, Teling Bawah, Kec. Wenang, Kota Manado, Sulawesi Utara
                </p>
              </div>
              <div className="flex-1 bg-[#fdf8ed] p-5 rounded-2xl border border-[#c49a45]/30">
                <h4 className="font-bold text-[#c49a45] mb-2">Pengumuman Penting:</h4>
                <ul className="list-disc pl-5 text-sm text-[#4b5e51] space-y-1 font-medium">
                  <li>Pastikan seluruh berkas pendaftaran telah diunggah.</li>
                  <li>Ujian Online (CBT) hanya dapat diakses setelah berkas diverifikasi oleh Panitia.</li>
                  <li>Pantau terus status kelulusan Anda di dasbor ini.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* GRID SECTION: FORMULIR & UJIAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CARD 1: DATA & BERKAS PENDAFTARAN */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
            <div className="w-14 h-14 bg-[#eef2ef] text-[#2b4d33] rounded-2xl flex items-center justify-center text-2xl mb-6">
              📄
            </div>
            <h2 className="text-2xl font-bold text-[#1a2e1f] mb-2">Data & Berkas Pendaftaran</h2>
            <p className="text-[#4b5e51] mb-6 flex-1">
              Lengkapi dokumen persyaratan (Ijazah, SKL, KK, Akta Kelahiran) agar pendaftaran dapat segera diverifikasi.
            </p>
            
            <div className="bg-[#f4f5f0] p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#4b5e51]">Status Verifikasi:</span>
                {studentData.verification_status === "verified" && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">Terverifikasi</span>
                )}
                {studentData.verification_status === "pending" && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">Menunggu Verifikasi</span>
                )}
                {studentData.verification_status === "rejected" && (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">Ditolak / Perbaiki Berkas</span>
                )}
              </div>
              <p className="text-xs text-gray-500">Nilai Rapor Terdaftar: <span className="font-bold">{studentData.report_score}</span></p>
            </div>

            <Link href="/dashboard/berkas" className="w-full text-center bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md">
              Lihat / Unggah Berkas
            </Link>
          </div>

          {/* CARD 2: UJIAN ONLINE (CBT) */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
            <div className="w-14 h-14 bg-[#fdf8ed] text-[#c49a45] rounded-2xl flex items-center justify-center text-2xl mb-6">
              💻
            </div>
            <h2 className="text-2xl font-bold text-[#1a2e1f] mb-2">Tes Ujian Online (CBT)</h2>
            <p className="text-[#4b5e51] mb-6 flex-1">
              Ujian masuk berbasis komputer. Siapkan koneksi internet yang stabil. Waktu pengerjaan adalah 45 Menit.
            </p>
            
            <div className="bg-[#f4f5f0] p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#4b5e51]">Status Kelulusan:</span>
                {studentData.graduation_status === "passed" && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">LULUS</span>
                )}
                {studentData.graduation_status === "failed" && (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">TIDAK LULUS</span>
                )}
                {studentData.graduation_status === "waiting" && (
                  <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-300">Belum Ada Hasil</span>
                )}
              </div>
            </div>

            {studentData.verification_status === "verified" ? (
              <Link href="/dashboard/ujian" className="w-full text-center bg-[#c49a45] hover:bg-[#b0883b] text-[#1a2e1f] font-bold py-3 px-4 rounded-xl transition-all shadow-md">
                Mulai Ujian Sekarang
              </Link>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-xl cursor-not-allowed">
                Terkunci (Belum Diverifikasi)
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}