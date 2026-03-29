"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/app/lib/axios";
import { User, Lock, Mail, MapPin, Calendar, Phone, GraduationCap, Users, Briefcase, ArrowLeft, Send, CheckCircle2, AlertCircle, FileText, ChevronDown } from "lucide-react";

// Reusable UI Components
const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="relative text-left">
    <label className="block text-sm font-bold text-[#4b5e51] mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a5baa9] group-focus-within:text-[#c49a45] transition-colors duration-300">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <input 
        {...props} 
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#f4f5f0]/50 hover:bg-[#f4f5f0] focus:bg-white focus:ring-2 focus:ring-[#c49a45]/50 focus:border-[#c49a45] shadow-sm hover:shadow-md outline-none transition-all duration-300 text-[#1a2e1f] font-semibold placeholder:text-[#a5baa9] placeholder:font-normal`} 
      />
    </div>
  </div>
);

const SelectField = ({ label, icon: Icon, children, ...props }) => (
  <div className="relative text-left">
    <label className="block text-sm font-bold text-[#4b5e51] mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a5baa9] group-focus-within:text-[#c49a45] transition-colors duration-300">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <select 
        {...props} 
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3.5 rounded-xl border border-gray-200 bg-[#f4f5f0]/50 hover:bg-[#f4f5f0] focus:bg-white focus:ring-2 focus:ring-[#c49a45]/50 focus:border-[#c49a45] shadow-sm hover:shadow-md outline-none transition-all duration-300 text-[#1a2e1f] font-semibold appearance-none cursor-pointer`}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#4b5e51]">
        <ChevronDown className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const TextAreaField = ({ label, icon: Icon, ...props }) => (
  <div className="relative md:col-span-2 text-left">
    <label className="block text-sm font-bold text-[#4b5e51] mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute top-4 left-4 flex items-center pointer-events-none text-[#a5baa9] group-focus-within:text-[#c49a45] transition-colors duration-300">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <textarea 
        {...props} 
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#f4f5f0]/50 hover:bg-[#f4f5f0] focus:bg-white focus:ring-2 focus:ring-[#c49a45]/50 focus:border-[#c49a45] shadow-sm hover:shadow-md outline-none transition-all duration-300 text-[#1a2e1f] font-semibold placeholder:text-[#a5baa9] placeholder:font-normal resize-none`} 
      ></textarea>
    </div>
  </div>
);

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
    <div className="min-h-screen bg-[#f4f5f0] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#c49a45] selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgba(26,46,31,0.08)] mb-6 border-4 border-[#f4f5f0] ring-4 ring-[#2b4d33]/10 transform transition-transform hover:scale-105 duration-300">
            <GraduationCap className="w-10 h-10 text-[#2b4d33]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1a2e1f] uppercase tracking-tight mb-4">
            Formulir <span className="text-[#c49a45]">PPDB</span>
          </h1>
          <p className="text-[#4b5e51] font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Lengkapi data diri dan informasi orang tua/wali dengan benar untuk keperluan administrasi Taruna Baru.
          </p>
        </div>

        {/* Notifikasi Message */}
        {msg && (
          <div className={`p-4 mb-8 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md transition-all duration-500 animate-in fade-in slide-in-from-top-4 border-2 ${isSuccess ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'}`}>
            {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-10">
          
          {/* BAGIAN 1: DATA AKUN */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5] relative overflow-hidden group hover:border-[#2b4d33]/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2b4d33] to-[#4a7c59]"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#f4f5f0] text-[#2b4d33] flex items-center justify-center rounded-2xl group-hover:bg-[#2b4d33] group-hover:text-white transition-colors duration-300 shadow-sm border border-[#e3e8e5] group-hover:border-transparent">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1a2e1f]">Data Akun</h2>
                <p className="text-[#4b5e51] text-sm font-medium mt-1">Kredensial untuk akses login CBT.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nama Lengkap Siswa" icon={User} type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Sesuai Ijazah" />
              <InputField label="Email Aktif" icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contoh@gmail.com" />
              <InputField label="Password" icon={Lock} type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Minimal 6 karakter" />
              <InputField label="Konfirmasi Password" icon={CheckCircle2} type="password" name="confPassword" value={formData.confPassword} onChange={handleChange} required placeholder="Ulangi password" />
            </div>
          </div>

          {/* BAGIAN 2: BIODATA SISWA */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5] relative overflow-hidden group hover:border-[#c49a45]/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#c49a45] to-[#e6bd65]"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#fdf8ed] text-[#c49a45] flex items-center justify-center rounded-2xl group-hover:bg-[#c49a45] group-hover:text-white transition-colors duration-300 shadow-sm border border-[#f5ebcd] group-hover:border-transparent">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1a2e1f]">Biodata Calon Siswa</h2>
                <p className="text-[#4b5e51] text-sm font-medium mt-1">Informasi utama identitas siswa.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Tempat Lahir" icon={MapPin} type="text" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} required placeholder="Kota Kelahiran" />
              <InputField label="Tanggal Lahir" icon={Calendar} type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
              
              <SelectField label="Jenis Kelamin" icon={Users} name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="" disabled>Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </SelectField>
              
              <InputField label="No. HP / WA (Siswa)" icon={Phone} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="08..." />
              
              <TextAreaField label="Alamat Lengkap" icon={MapPin} name="address" value={formData.address} onChange={handleChange} required rows="3" placeholder="Alamat domisili saat ini" />
              
              <InputField label="Asal Sekolah (SD)" icon={GraduationCap} type="text" name="origin_school" value={formData.origin_school} onChange={handleChange} required placeholder="Contoh: SDN 1 Manado" />
              <InputField label="Nilai Rata-rata Rapor" icon={FileText} type="number" step="0.01" name="report_score" value={formData.report_score} onChange={handleChange} required placeholder="Contoh: 85.50" />
            </div>
          </div>

          {/* BAGIAN 3: DATA ORANG TUA */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5] relative overflow-hidden group hover:border-[#1a2e1f]/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1a2e1f] to-[#3a5a44]"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#e3e8e5] text-[#1a2e1f] flex items-center justify-center rounded-2xl group-hover:bg-[#1a2e1f] group-hover:text-white transition-colors duration-300 shadow-sm border border-[#d2dbd6] group-hover:border-transparent">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1a2e1f]">Data Orang Tua / Wali</h2>
                <p className="text-[#4b5e51] text-sm font-medium mt-1">Informasi wali murid yang bertanggung jawab.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Hubungan dengan Siswa" icon={Users} name="relationship" value={formData.relationship} onChange={handleChange} required>
                <option value="Ayah">Ayah</option>
                <option value="Ibu">Ibu</option>
                <option value="Wali">Wali</option>
              </SelectField>
              
              <InputField label="Nama Lengkap Orang Tua/Wali" icon={User} type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} required placeholder="Nama lengkap" />
              <InputField label="Tempat Lahir" icon={MapPin} type="text" name="parent_place_of_birth" value={formData.parent_place_of_birth} onChange={handleChange} required placeholder="Kota kelahiran" />
              <InputField label="Tanggal Lahir" icon={Calendar} type="date" name="parent_date_of_birth" value={formData.parent_date_of_birth} onChange={handleChange} required />
              <InputField label="No. HP / WA (Aktif)" icon={Phone} type="tel" name="parent_phone" value={formData.parent_phone} onChange={handleChange} required placeholder="08..." />
              <InputField label="Pekerjaan" icon={Briefcase} type="text" name="occupation" value={formData.occupation} onChange={handleChange} required placeholder="Contoh: PNS, Wiraswasta" />
              <InputField label="Email Orang Tua (Opsional)" icon={Mail} type="email" name="parent_email" value={formData.parent_email} onChange={handleChange} placeholder="contoh@gmail.com" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-6 justify-between items-center bg-white p-6 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5]">
            <Link href="/" className="group flex items-center gap-2 text-[#4b5e51] hover:text-[#c49a45] font-bold transition-colors w-full sm:w-auto justify-center">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>
            
            <button 
              type="submit" 
              disabled={isLoading || isSuccess}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_8px_20px_rgba(43,77,51,0.3)] hover:shadow-[0_8px_30px_rgba(26,46,31,0.4)] transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none uppercase tracking-wider overflow-hidden relative group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              
              <span>{isLoading ? "Memproses Data..." : "Kirim Pendaftaran"}</span>
              {!isLoading && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </div>
          
          <div className="text-center pb-12 mt-8">
            <p className="text-[#4b5e51] font-medium text-lg">
              Sudah punya akun? 
              <Link href="/login" className="ml-2 text-[#2b4d33] font-bold hover:text-[#c49a45] hover:underline transition-colors">
                Login di sini
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}