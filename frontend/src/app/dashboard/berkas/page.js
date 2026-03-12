"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";

export default function BerkasSiswa() {
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // State untuk menampung file yang dipilih
  const [files, setFiles] = useState({
    file_ijazah: null,
    file_skl: null,
    file_kk: null,
    file_akte: null
  });

  const router = useRouter();

  // Fetch data user dan dokumen yang sudah diupload
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await axios.get("/me");
        if (resUser.data.role !== "siswa") return router.push("/login");
        setUser(resUser.data);

        const resDocs = await axios.get("/documents");
        setDocuments(resDocs.data);
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMsg({ text: "", type: "" });

    const formData = new FormData();
    let hasFile = false;

    // Append file ke FormData jika ada yang dipilih
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]);
        hasFile = true;
      }
    });

    if (!hasFile) {
      setMsg({ text: "Pilih minimal 1 dokumen untuk diunggah.", type: "error" });
      setIsUploading(false);
      return;
    }

    try {
      const response = await axios.post("/upload-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMsg({ text: response.data.msg, type: "success" });
      
      // Refresh daftar dokumen setelah upload sukses
      const resDocs = await axios.get("/documents");
      setDocuments(resDocs.data);
      
      // Kosongkan form input
      setFiles({ file_ijazah: null, file_skl: null, file_kk: null, file_akte: null });
      document.getElementById("form-upload").reset();

    } catch (error) {
      setMsg({ 
        text: error.response?.data?.msg || "Terjadi kesalahan saat mengunggah file.", 
        type: "error" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Helper untuk mengecek apakah dokumen tertentu sudah diupload
  const getExistingDoc = (type) => {
    // Normalisasi pencarian (karena di backend kita pakai ijazah/ijasah)
    const searchType = type === 'ijasah' ? 'ijazah' : type;
    return documents.find(doc => doc.doc_type === searchType);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#e3e8e5] flex items-center justify-center"><p className="text-xl font-bold text-[#2b4d33] animate-pulse">Memuat Data Berkas...</p></div>;
  }

  const isVerified = user?.student?.verification_status === "verified";

  return (
    <div className="min-h-screen bg-[#e3e8e5] text-[#1a2e1f] font-sans pb-12">
      {/* NAVBAR SIMPLE */}
      <nav className="bg-[#1a2e1f] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-[#a5baa9] hover:text-white transition-colors">
              <span>← Kembali ke Dasbor</span>
            </Link>
            <span className="font-bold text-[#c49a45] tracking-wide hidden sm:block">Manajemen Berkas</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1a2e1f] uppercase tracking-wider mb-2">Unggah Berkas Persyaratan</h1>
          <p className="text-[#4b5e51] font-medium">Unggah dokumen dalam format JPG, PNG, atau PDF (Maksimal 5MB per dokumen).</p>
        </div>

        {/* PESAN NOTIFIKASI */}
        {msg.text && (
          <div className={`p-4 mb-6 rounded-xl font-bold border ${msg.type === 'success' ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'}`}>
            {msg.text}
          </div>
        )}

        {isVerified && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl text-sm font-bold">
            ⚠️ Berkas Anda telah diverifikasi. Anda tidak perlu mengunggah ulang dokumen kecuali diminta oleh panitia.
          </div>
        )}

        {/* DAFTAR DOKUMEN YANG HARUS DIUNGGAH */}
        <form id="form-upload" onSubmit={handleUpload} className="space-y-6">
          
          <div className="bg-white rounded-3xl shadow-lg border-t-4 border-[#2b4d33] overflow-hidden">
            <div className="divide-y divide-gray-100">
              
              {/* Item 1: Ijazah */}
              <div className="p-6 md:flex md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:w-1/2">
                  <h3 className="font-bold text-lg text-[#1a2e1f] flex items-center gap-2">
                    Ijazah SD / Sederajat
                    {getExistingDoc('ijazah') && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">✓ Sudah Ada</span>}
                  </h3>
                  <p className="text-sm text-[#4b5e51] mt-1">Scan asli Ijazah atau fotokopi legalisir.</p>
                  {getExistingDoc('ijazah') && (
                    <a href={getExistingDoc('ijazah').file_path} target="_blank" rel="noreferrer" className="text-sm text-[#c49a45] hover:underline mt-2 inline-block font-bold">
                      👀 Lihat File Tersimpan
                    </a>
                  )}
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <input type="file" name="file_ijazah" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-sm text-[#4b5e51] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#eef2ef] file:text-[#2b4d33] hover:file:bg-[#dce3de] transition-all cursor-pointer border border-gray-200 rounded-full p-1" />
                </div>
              </div>

              {/* Item 2: SKL */}
              <div className="p-6 md:flex md:items-center md:justify-between bg-gray-50">
                <div className="mb-4 md:mb-0 md:w-1/2">
                  <h3 className="font-bold text-lg text-[#1a2e1f] flex items-center gap-2">
                    Surat Keterangan Lulus (SKL)
                    {getExistingDoc('skl') && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">✓ Sudah Ada</span>}
                  </h3>
                  <p className="text-sm text-[#4b5e51] mt-1">Gunakan SKL jika Ijazah belum terbit.</p>
                  {getExistingDoc('skl') && (
                    <a href={getExistingDoc('skl').file_path} target="_blank" rel="noreferrer" className="text-sm text-[#c49a45] hover:underline mt-2 inline-block font-bold">
                      👀 Lihat File Tersimpan
                    </a>
                  )}
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <input type="file" name="file_skl" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-sm text-[#4b5e51] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#eef2ef] file:text-[#2b4d33] hover:file:bg-[#dce3de] transition-all cursor-pointer border border-gray-200 rounded-full p-1" />
                </div>
              </div>

              {/* Item 3: Kartu Keluarga */}
              <div className="p-6 md:flex md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:w-1/2">
                  <h3 className="font-bold text-lg text-[#1a2e1f] flex items-center gap-2">
                    Kartu Keluarga (KK)
                    {getExistingDoc('kk') && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">✓ Sudah Ada</span>}
                  </h3>
                  <p className="text-sm text-[#4b5e51] mt-1">Scan KK asli keluaran terbaru.</p>
                  {getExistingDoc('kk') && (
                    <a href={getExistingDoc('kk').file_path} target="_blank" rel="noreferrer" className="text-sm text-[#c49a45] hover:underline mt-2 inline-block font-bold">
                      👀 Lihat File Tersimpan
                    </a>
                  )}
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <input type="file" name="file_kk" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-sm text-[#4b5e51] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#eef2ef] file:text-[#2b4d33] hover:file:bg-[#dce3de] transition-all cursor-pointer border border-gray-200 rounded-full p-1" />
                </div>
              </div>

              {/* Item 4: Akta Kelahiran */}
              <div className="p-6 md:flex md:items-center md:justify-between bg-gray-50">
                <div className="mb-4 md:mb-0 md:w-1/2">
                  <h3 className="font-bold text-lg text-[#1a2e1f] flex items-center gap-2">
                    Akta Kelahiran
                    {getExistingDoc('akte') && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">✓ Sudah Ada</span>}
                  </h3>
                  <p className="text-sm text-[#4b5e51] mt-1">Scan asli Akta Kelahiran calon siswa.</p>
                  {getExistingDoc('akte') && (
                    <a href={getExistingDoc('akte').file_path} target="_blank" rel="noreferrer" className="text-sm text-[#c49a45] hover:underline mt-2 inline-block font-bold">
                      👀 Lihat File Tersimpan
                    </a>
                  )}
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <input type="file" name="file_akte" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="block w-full text-sm text-[#4b5e51] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#eef2ef] file:text-[#2b4d33] hover:file:bg-[#dce3de] transition-all cursor-pointer border border-gray-200 rounded-full p-1" />
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full sm:w-auto px-8 py-4 bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isUploading ? "Mengunggah..." : "☁️ Unggah Berkas Terpilih"}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}