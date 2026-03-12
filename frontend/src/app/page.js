import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      {/* HERO SECTION (Nuansa Hijau Militer) */}
      <section className="relative bg-[#1a2e1f] text-[#e8ebe3] overflow-hidden min-h-[90vh] flex items-center justify-center rounded-b-[3rem] lg:rounded-b-[5rem] shadow-2xl">
        {/* Ornamen Background biar ga sepi */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#4a7c59] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#314f3b] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            {/* Logo Placeholder (Bisa diganti image beneran nanti) */}
            <div className="w-20 h-20 bg-[#c49a45] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(196,154,69,0.4)] border-4 border-[#2b4d33]">
              <span className="text-2xl font-black text-[#1a2e1f]">SMP</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white drop-shadow-lg uppercase">
            Penerimaan Taruna Baru
          </h1>
          <p className="text-lg md:text-xl text-[#a5baa9] mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Siapkan diri Anda menjadi generasi disiplin, tangguh, dan berprestasi. Sistem Pendaftaran & Ujian Berbasis Komputer (CBT) Terpadu.
          </p>
          
          {/* Action Buttons (Mobile First: Stack ke bawah di HP, Sampingan di PC) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-[#c49a45] hover:bg-[#b0883b] text-[#1a2e1f] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg uppercase tracking-wider"
            >
              📝 Daftar Sekarang
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-[#2b4d33] hover:bg-[#386342] text-white border border-[#4a7c59] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg uppercase tracking-wider"
            >
              🔑 Login Calon Siswa
            </Link>
          </div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="py-20 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-[#1a2e1f] mb-2 uppercase">Alur Pendaftaran</h2>
          <div className="w-20 h-1 bg-[#c49a45] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#2b4d33] transform transition hover:-translate-y-2">
            <div className="w-14 h-14 bg-[#eef2ef] text-[#2b4d33] flex items-center justify-center rounded-xl text-2xl font-black mb-6">1</div>
            <h3 className="text-xl font-bold mb-3 text-[#1a2e1f]">Isi Biodata</h3>
            <p className="text-[#4b5e51] font-medium leading-relaxed">Isi formulir pendaftaran secara online meliputi data diri calon siswa, data orang tua/wali, dan nilai rapor.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#c49a45] transform transition hover:-translate-y-2">
            <div className="w-14 h-14 bg-[#fdf8ed] text-[#c49a45] flex items-center justify-center rounded-xl text-2xl font-black mb-6">2</div>
            <h3 className="text-xl font-bold mb-3 text-[#1a2e1f]">Upload Berkas</h3>
            <p className="text-[#4b5e51] font-medium leading-relaxed">Unggah dokumen persyaratan seperti Ijazah, SKL, Kartu Keluarga, dan Akta Kelahiran dalam format digital.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#1a2e1f] transform transition hover:-translate-y-2">
            <div className="w-14 h-14 bg-[#e3e8e5] text-[#1a2e1f] flex items-center justify-center rounded-xl text-2xl font-black mb-6">3</div>
            <h3 className="text-xl font-bold mb-3 text-[#1a2e1f]">Ujian CBT</h3>
            <p className="text-[#4b5e51] font-medium leading-relaxed">Ikuti Computer Based Test (CBT) secara online dari rumah setelah pendaftaran diverifikasi oleh panitia.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#112015] py-8 text-center text-[#678270] text-sm">
        <p>© {new Date().getFullYear()} Panitia PPDB SMP Militer. All rights reserved.</p>
        <p className="mt-1">Sistem Pendaftaran & CBT Terintegrasi.</p>
      </footer>
    </main>
  );
}