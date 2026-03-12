import "./globals.css";

export const metadata = {
  title: "PPDB & CBT",
  description: "Sistem Penerimaan Peserta Didik Baru & Ujian Online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      {/* Tema Dasar: Krem terang (mirip kertas dokumen) dengan teks hijau gelap */}
      <body className="bg-[#f4f5f0] text-[#1a2e1f] font-sans antialiased selection:bg-[#4d322b] selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}