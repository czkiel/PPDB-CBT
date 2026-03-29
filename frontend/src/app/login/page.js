"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/app/lib/axios";
import { Mail, Lock, LogIn, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const Auth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    try {
      const response = await axios.post("/login", {
        email: email,
        password: password,
      });
      
      // Arahkan berdasarkan role
      if (response.data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Terjadi kesalahan pada server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f0] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#c49a45] selection:text-white">
      
      {/* Dynamic Military-themed Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-[#2b4d33] rounded-full mix-blend-multiply blur-[120px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-[#c49a45] rounded-full mix-blend-multiply blur-[120px] opacity-[0.15]"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Main Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(26,46,31,0.08)] border border-[#e3e8e5] relative overflow-hidden group">
          
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2b4d33] via-[#c49a45] to-[#2b4d33]"></div>

          {/* Header Area */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-[#f4f5f0] rounded-2xl flex items-center justify-center shadow-inner border-2 border-[#e3e8e5] mb-6 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 relative">
              <div className="absolute inset-0 bg-[#c49a45] opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
              <ShieldCheck className="w-12 h-12 text-[#2b4d33] stroke-[1.5]" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a2e1f] uppercase tracking-tight mb-2">
              Akses <span className="text-[#c49a45]">Portal</span>
            </h2>
            <p className="text-[#4b5e51] font-medium text-sm sm:text-base">
              Identifikasi diri Anda untuk masuk ke sistem
            </p>
          </div>

          {/* Error Message */}
          {msg && (
            <div className="mb-6 p-4 rounded-2xl bg-[#fdf3f4] text-[#d32f2f] border border-[#facccf] flex items-center gap-3 font-semibold text-sm animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={Auth}>
            
            {/* Input Email */}
            <div className="space-y-5">
              <div className="relative text-left group/input">
                <label className="block text-sm font-bold text-[#4b5e51] mb-2 ml-1">Email Aktif</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a5baa9] group-focus-within/input:text-[#c49a45] transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#f4f5f0]/50 hover:bg-[#f4f5f0] focus:bg-white focus:ring-2 focus:ring-[#c49a45]/50 focus:border-[#c49a45] shadow-sm outline-none transition-all duration-300 text-[#1a2e1f] font-semibold placeholder:text-[#a5baa9] placeholder:font-normal"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="relative text-left group/input">
                <label className="block text-sm font-bold text-[#4b5e51] mb-2 ml-1">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a5baa9] group-focus-within/input:text-[#c49a45] transition-colors duration-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#f4f5f0]/50 hover:bg-[#f4f5f0] focus:bg-white focus:ring-2 focus:ring-[#c49a45]/50 focus:border-[#c49a45] shadow-sm outline-none transition-all duration-300 text-[#1a2e1f] font-semibold placeholder:text-[#a5baa9] placeholder:font-normal tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 group relative w-full flex justify-center items-center gap-3 py-4 px-4 text-base font-bold rounded-2xl text-white bg-[#2b4d33] hover:bg-[#1a2e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2b4d33] shadow-[0_8px_20px_rgba(43,77,51,0.25)] hover:shadow-[0_12px_25px_rgba(26,46,31,0.35)] transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none uppercase tracking-widest overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span>{isLoading ? "Memverifikasi..." : "Masuk Sistem"}</span>
              {!isLoading && <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
          
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <p className="text-sm sm:text-base text-[#4b5e51] font-medium bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm border border-white shadow-sm">
            Calon Siswa/Siswi Baru?{" "}
            <Link href="/register" className="font-bold text-[#2b4d33] hover:text-[#c49a45] transition-colors ml-1">
              Daftar Sekarang
            </Link>
          </p>
          
          <Link href="/" className="group flex items-center gap-2 text-sm text-[#4b5e51] hover:text-[#1a2e1f] font-bold transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}