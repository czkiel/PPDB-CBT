"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/app/lib/axios";

export default function Register() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State untuk seluruh input form
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confPassword: "",
    place_of_birth: "", date_of_birth: "", gender: "", address: "", phone: "", origin_school: "", report_score: "",
    parent_name: "", parent_place_of_birth: "", parent_date_of_birth: "", parent_phone: "", parent_email: "", occupation: "", relationship: "Ayah"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    
    // Konversi report_score dari string ke float sebelum dikirim
    const payload = { ...formData, report_score: parseFloat(formData.report_score) || 0 };

    try {
      const response = await axios.post("/register", payload);
      setMsg(response.data.msg);
      setIsSuccess(true);
      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan pada server.");
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e8e5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#1a2e1f] uppercase tracking-wider mb-2">Formulir PPDB Taruna Baru</h1>
          <p className="text-[#4b5e51] font-medium">Mohon isi data diri dan orang tua/wali dengan lengkap dan benar.</p>
        </div>

        {/* Notifikasi Message */}
        {msg && (
          <div className={`p-4 mb-6 rounded-xl font-bold text-center border ${isSuccess ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* BAGIAN 1: DATA AKUN */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-4 border-[#2b4d33]">
            <h2 className="text-xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
              <span className="bg-[#2b4d33] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">1</span>
              Data Akun (Untuk Login)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Nama Lengkap Siswa</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] focus:border-transparent outline-none transition-all" placeholder="Sesuai Ijazah" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Email Aktif</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] focus:border-transparent outline-none transition-all" placeholder="contoh@gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] focus:border-transparent outline-none transition-all" placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Konfirmasi Password</label>
                <input type="password" name="confPassword" value={formData.confPassword} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] focus:border-transparent outline-none transition-all" placeholder="Ulangi password" />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: BIODATA SISWA */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-4 border-[#c49a45]">
            <h2 className="text-xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
              <span className="bg-[#c49a45] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">2</span>
              Biodata Calon Siswa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Tempat Lahir</label>
                <input type="text" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Kota Kelahiran" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Tanggal Lahir</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Jenis Kelamin</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none bg-white">
                  <option value="" disabled>Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">No. HP / WA (Siswa)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="08..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Alamat Lengkap</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Alamat domisili saat ini"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Asal Sekolah (SD)</label>
                <input type="text" name="origin_school" value={formData.origin_school} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Contoh: SDN 1 Manado" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Nilai Rata-rata Rapor</label>
                <input type="number" step="0.01" name="report_score" value={formData.report_score} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Contoh: 85.50" />
              </div>
            </div>
          </div>

          {/* BAGIAN 3: DATA ORANG TUA */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-4 border-[#1a2e1f]">
            <h2 className="text-xl font-bold text-[#1a2e1f] mb-6 flex items-center gap-2">
              <span className="bg-[#1a2e1f] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">3</span>
              Data Orang Tua / Wali
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Hubungan dengan Siswa</label>
                <select name="relationship" value={formData.relationship} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none bg-white">
                  <option value="Ayah">Ayah</option>
                  <option value="Ibu">Ibu</option>
                  <option value="Wali">Wali</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Nama Lengkap Orang Tua/Wali</label>
                <input type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Tempat Lahir</label>
                <input type="text" name="parent_place_of_birth" value={formData.parent_place_of_birth} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Kota kelahiran" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Tanggal Lahir</label>
                <input type="date" name="parent_date_of_birth" value={formData.parent_date_of_birth} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">No. HP / WA (Aktif)</label>
                <input type="tel" name="parent_phone" value={formData.parent_phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="08..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Pekerjaan</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="Contoh: PNS, Wiraswasta" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Email Orang Tua (Opsional)</label>
                <input type="email" name="parent_email" value={formData.parent_email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none" placeholder="contoh@gmail.com" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl shadow-lg">
            <Link href="/" className="text-[#4b5e51] hover:text-[#1a2e1f] font-bold transition-colors">
              ← Kembali ke Beranda
            </Link>
            <button 
              type="submit" 
              disabled={isLoading || isSuccess}
              className="w-full sm:w-auto px-10 py-4 bg-[#2b4d33] hover:bg-[#386342] text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {isLoading ? "Memproses Data..." : "Kirim Formulir Pendaftaran"}
            </button>
          </div>
          
          <div className="text-center pb-10">
            <p className="text-[#4b5e51] font-medium">Sudah punya akun? <Link href="/login" className="text-[#c49a45] font-bold hover:underline">Login di sini</Link></p>
          </div>

        </form>
      </div>
    </div>
  );
}