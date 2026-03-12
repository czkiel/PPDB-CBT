"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/app/lib/axios";

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
    <div className="min-h-screen bg-[#e3e8e5] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ornamen Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2b4d33] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#c49a45] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl relative z-10 border-t-8 border-[#1a2e1f]">
        <div>
          <div className="mx-auto w-20 h-20 bg-[#c49a45] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2b4d33] mb-6">
            <span className="text-2xl font-black text-[#1a2e1f]">SMP</span>
          </div>
          <h2 className="text-center text-3xl font-black text-[#1a2e1f] uppercase tracking-wider">
            Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-[#4b5e51] font-medium">
            Masuk ke dasbor Calon Taruna Baru
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={Auth}>
          {msg && (
            <div className="p-4 rounded-xl bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb] text-center font-bold text-sm">
              {msg}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-bold text-[#4b5e51] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] focus:border-transparent outline-none transition-all"
                placeholder="Email yang didaftarkan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#4b5e51] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#2b4d33] hover:bg-[#1a2e1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2b4d33] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {isLoading ? "Memeriksa Kredensial..." : "Masuk Sistem"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-[#4b5e51] font-medium">
            Belum mendaftar?{" "}
            <Link href="/register" className="font-bold text-[#c49a45] hover:text-[#b0883b] transition-colors">
              Registrasi di sini
            </Link>
          </p>
          <div className="mt-6">
            <Link href="/" className="text-sm text-[#4b5e51] hover:text-[#1a2e1f] font-bold transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}