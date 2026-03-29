"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  FileBadge, 
  Users, 
  Baby, 
  ShieldAlert,
  Loader2
} from "lucide-react";

// Reusable Document Upload Row Component to keep the code DRY
const DocumentUploadRow = ({ title, desc, icon: Icon, docType, existingDoc, onChange, isEven }) => {
  return (
    <div className={`p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300 ${isEven ? 'bg-[#f4f5f0]/30' : 'bg-white'} hover:bg-[#f4f5f0]`}>
      
      {/* Title & Info Section */}
      <div className="flex items-start gap-4 md:w-1/2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${existingDoc ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : 'bg-[#e3e8e5] text-[#1a2e1f] border-[#d2dbd6]'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#1a2e1f] flex flex-wrap items-center gap-2">
            {title}
            {existingDoc && (
              <span className="bg-[#d4edda] text-[#155724] text-xs px-2.5 py-1 rounded-md border border-[#c3e6cb] flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan
              </span>
            )}
          </h3>
          <p className="text-sm text-[#4b5e51] mt-1.5 font-medium leading-relaxed">{desc}</p>
          
          {existingDoc && (
            <a 
              href={existingDoc.file_path} 
              target="_blank" 
              rel="noreferrer" 
              className="mt-3 group inline-flex items-center gap-1.5 text-sm text-[#c49a45] hover:text-[#b0883b] font-bold transition-colors"
            >
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Lihat Dokumen
            </a>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="md:w-1/2 md:pl-8 flex justify-end">
        <div className="relative w-full max-w-sm">
          <input 
            type="file" 
            name={`file_${docType}`} 
            onChange={onChange} 
            accept=".jpg,.jpeg,.png,.pdf" 
            className="block w-full text-sm text-[#4b5e51] 
              file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 
              file:text-sm file:font-bold file:bg-[#2b4d33] file:text-white 
              hover:file:bg-[#1a2e1f] file:transition-all file:cursor-pointer file:shadow-md
              border border-gray-200 rounded-2xl p-1.5 bg-white shadow-sm focus:ring-2 focus:ring-[#c49a45] outline-none transition-all" 
          />
        </div>
      </div>
    </div>
  );
};

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
    return (
      <div className="min-h-screen bg-[#f4f5f0] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#c49a45] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-[#2b4d33] tracking-widest uppercase animate-pulse">Memuat Berkas...</p>
      </div>
    );
  }

  const isVerified = user?.student?.verification_status === "verified";

  return (
    <div className="min-h-screen bg-[#f4f5f0] text-[#1a2e1f] font-sans pb-16 selection:bg-[#c49a45] selection:text-white">
      
      {/* NAVBAR */}
      <nav className="bg-[#1a2e1f] text-white shadow-lg sticky top-0 z-50 border-b border-[#2b4d33]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/dashboard" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-[#a5baa9] hover:text-white transition-all duration-300 border border-transparent hover:border-white/10">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Kembali ke Dasbor</span>
            </Link>
            <div className="flex items-center gap-3">
              <UploadCloud className="w-6 h-6 text-[#c49a45] hidden sm:block" />
              <span className="font-black text-lg text-white tracking-wide uppercase hidden sm:block">Manajemen Berkas</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* HEADER AREA */}
        <div className="mb-10 text-center sm:text-left bg-white p-8 rounded-3xl shadow-sm border border-[#e3e8e5]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eef2ef] rounded-2xl mb-6 text-[#2b4d33] sm:hidden mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a2e1f] uppercase tracking-tight mb-3">
            Unggah <span className="text-[#c49a45]">Berkas</span>
          </h1>
          <p className="text-[#4b5e51] font-medium text-lg">
            Unggah dokumen persyaratan legal dalam format <span className="font-bold text-[#1a2e1f]">JPG, PNG, atau PDF</span>. Maksimal ukuran file adalah <span className="font-bold text-[#1a2e1f]">5MB</span> per dokumen.
          </p>
        </div>

        {/* ALERTS / NOTIFICATIONS */}
        {msg.text && (
          <div className={`p-4 mb-8 rounded-2xl font-bold flex items-center gap-3 shadow-sm border-2 animate-in slide-in-from-top-4 ${msg.type === 'success' ? 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]' : 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]'}`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="flex-1">{msg.text}</span>
          </div>
        )}

        {isVerified && (
          <div className="mb-8 p-5 bg-[#fff3cd] border-2 border-[#ffeeba] text-[#856404] rounded-2xl flex items-start gap-4 shadow-sm">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black mb-1 uppercase tracking-wider text-sm">Status: Terverifikasi</h4>
              <p className="font-medium text-sm leading-relaxed">
                Berkas Anda telah diverifikasi oleh Panitia. Anda tidak perlu mengunggah ulang dokumen kecuali ada instruksi khusus.
              </p>
            </div>
          </div>
        )}

        {/* UPLOAD FORM */}
        <form id="form-upload" onSubmit={handleUpload} className="space-y-8">
          
          <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(26,46,31,0.05)] border-t-8 border-[#2b4d33] overflow-hidden group hover:border-[#2b4d33]/80 transition-colors duration-300">
            <div className="divide-y divide-gray-100">
              
              <DocumentUploadRow 
                title="Ijazah SD / Sederajat"
                desc="Scan dokumen asli Ijazah atau fotokopi yang telah dilegalisir basah."
                icon={FileBadge}
                docType="ijazah"
                existingDoc={getExistingDoc('ijazah')}
                onChange={handleFileChange}
                isEven={false}
              />

              <DocumentUploadRow 
                title="Surat Keterangan Lulus (SKL)"
                desc="Gunakan SKL sah dari sekolah asal jika Ijazah resmi belum terbit."
                icon={FileText}
                docType="skl"
                existingDoc={getExistingDoc('skl')}
                onChange={handleFileChange}
                isEven={true}
              />

              <DocumentUploadRow 
                title="Kartu Keluarga (KK)"
                desc="Scan dokumen Kartu Keluarga asli keluaran terbaru."
                icon={Users}
                docType="kk"
                existingDoc={getExistingDoc('kk')}
                onChange={handleFileChange}
                isEven={false}
              />

              <DocumentUploadRow 
                title="Akta Kelahiran"
                desc="Scan dokumen asli Akta Kelahiran calon siswa yang sah."
                icon={Baby}
                docType="akte"
                existingDoc={getExistingDoc('akte')}
                onChange={handleFileChange}
                isEven={true}
              />

            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-end pt-2 pb-10">
            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full sm:w-auto relative group flex items-center justify-center gap-3 px-10 py-4 lg:py-5 bg-[#c49a45] hover:bg-[#b0883b] text-[#1a2e1f] font-black rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(196,154,69,0.3)] hover:shadow-[0_12px_40px_rgba(196,154,69,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none uppercase tracking-widest overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Mengunggah Data...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                  <span>Simpan & Unggah Berkas</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}