import Link from "next/link";
import { ArrowRight, FileSignature, ShieldCheck, Laptop, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 bg-[#f4f5f0]">
      {/* HERO SECTION */}
      <section className="relative bg-[#1a2e1f] overflow-hidden min-h-[90vh] flex items-center justify-center rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-2xl">
        {/* Abstract Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2b4d33] rounded-full blur-[100px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#4a7c59] rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-[#c49a45] rounded-full blur-[100px] opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col items-center text-center max-w-5xl">
          {/* Logo / Emblem */}
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-[#c49a45] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#c49a45] to-[#997734] rounded-full flex items-center justify-center border-4 border-[#1a2e1f] shadow-2xl transform transition-transform duration-500 hover:scale-105">
              <GraduationCap className="w-12 h-12 text-[#1a2e1f]" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2b4d33]/50 border border-[#4a7c59]/50 backdrop-blur-sm mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#c49a45] animate-ping" />
            <span className="text-sm font-semibold tracking-wider text-[#e8ebe3] uppercase">Tahun Ajaran 2026/2027</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-white uppercase leading-[1.1]">
            Penerimaan <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c49a45] to-[#f0c365]">Siswa/Siswi Baru</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-[#a5baa9] mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Siapkan diri Anda menjadi generasi disiplin, tangguh, dan berprestasi. Sistem Pendaftaran & Ujian Berbasis Komputer (CBT) Terpadu secara Mobile-First.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link 
              href="/register" 
              className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#c49a45] hover:bg-[#d4a853] text-[#1a2e1f] font-bold rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(196,154,69,0.3)] hover:shadow-[0_8px_40px_rgba(196,154,69,0.5)] transform hover:-translate-y-1 text-lg uppercase tracking-wider overflow-hidden"
            >
              <FileSignature className="w-6 h-6" />
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#2b4d33]/80 hover:bg-[#386342] text-white border-2 border-[#4a7c59]/50 backdrop-blur-sm font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg uppercase tracking-wider"
            >
              🔑 Login Calon Siswa
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="text-xs uppercase tracking-widest text-[#a5baa9] font-medium">Scroll ke bawah</span>
          <div className="w-5 h-8 border-2 border-[#a5baa9] rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-[#c49a45] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="py-24 px-6 container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-[#c49a45] uppercase mb-3">Panduan Langkah</h2>
          <h3 className="text-3xl md:text-5xl font-black text-[#1a2e1f] mb-6 uppercase">Alur Pendaftaran</h3>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#2b4d33] to-[#c49a45] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#e3e8e5] via-[#a5baa9] to-[#e3e8e5] z-0"></div>

          {/* Card 1 */}
          <div className="relative z-10 bg-white p-8 lg:p-10 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5] hover:border-[#2b4d33]/30 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(43,77,51,0.1)] group">
            <div className="w-20 h-20 bg-[#f4f5f0] group-hover:bg-[#2b4d33] transition-colors duration-300 text-[#2b4d33] group-hover:text-white flex items-center justify-center rounded-2xl mb-8 mx-auto shadow-sm">
              <FileSignature className="w-10 h-10" />
            </div>
            
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#2b4d33] text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform">1</div>
            
            <h4 className="text-2xl font-bold mb-4 text-[#1a2e1f] text-center group-hover:text-[#2b4d33] transition-colors">Isi Biodata</h4>
            <p className="text-[#4b5e51] font-medium leading-relaxed text-center">Isi formulir pendaftaran secara online meliputi data diri calon siswa, data orang tua/wali, dan nilai rapor sebagai syarat awal administrasi.</p>
          </div>

          {/* Card 2 */}
          <div className="relative z-10 bg-white p-8 lg:p-10 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5] hover:border-[#c49a45]/30 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(196,154,69,0.15)] group md:translate-y-4">
            <div className="w-20 h-20 bg-[#fdf8ed] group-hover:bg-[#c49a45] transition-colors duration-300 text-[#c49a45] group-hover:text-white flex items-center justify-center rounded-2xl mb-8 mx-auto shadow-sm">
              <ShieldCheck className="w-10 h-10" />
            </div>
            
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#c49a45] text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg transform -rotate-3 group-hover:-rotate-6 transition-transform">2</div>
            
            <h4 className="text-2xl font-bold mb-4 text-[#1a2e1f] text-center group-hover:text-[#c49a45] transition-colors">Upload Berkas</h4>
            <p className="text-[#4b5e51] font-medium leading-relaxed text-center">Unggah dokumen persyaratan digital (Ijazah, SKL, Kartu Keluarga, Akta) untuk diverifikasi keasliannya oleh tim Panitia.</p>
          </div>

          {/* Card 3 */}
          <div className="relative z-10 bg-white p-8 lg:p-10 rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border border-[#e3e8e5] hover:border-[#1a2e1f]/30 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(26,46,31,0.15)] group">
            <div className="w-20 h-20 bg-[#e3e8e5] group-hover:bg-[#1a2e1f] transition-colors duration-300 text-[#1a2e1f] group-hover:text-white flex items-center justify-center rounded-2xl mb-8 mx-auto shadow-sm">
              <Laptop className="w-10 h-10" />
            </div>
            
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#1a2e1f] text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform">3</div>
            
            <h4 className="text-2xl font-bold mb-4 text-[#1a2e1f] text-center group-hover:text-[#1a2e1f] transition-colors">Ujian CBT</h4>
            <p className="text-[#4b5e51] font-medium leading-relaxed text-center">Ikuti Computer Based Test (CBT) interaktif dengan keamanan tinggi secara online melalui perangkat mobile atau komputer di rumah.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#112015] border-t border-[#2b4d33]/50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2b4d33] via-[#c49a45] to-[#2b4d33]"></div>
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2b4d33] rounded-full flex items-center justify-center border-2 border-[#4a7c59]">
                 <GraduationCap className="w-6 h-6 text-[#c49a45]" />
              </div>
              <div>
                <h5 className="text-[#e8ebe3] font-bold text-lg">PPDB SMP Militer</h5>
                <p className="text-[#678270] text-sm font-medium">Sistem CBT & Pendaftaran Terintegrasi</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[#678270] font-medium text-sm">
                © {new Date().getFullYear()} Panitia PPDB. All rights reserved.
              </p>
              <div className="flex gap-4 mt-3 justify-center md:justify-end">
                <a href="#" className="text-[#678270] hover:text-[#c49a45] transition-colors text-sm font-medium">Bantuan</a>
                <a href="#" className="text-[#678270] hover:text-[#c49a45] transition-colors text-sm font-medium">Kebijakan Privasi</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}