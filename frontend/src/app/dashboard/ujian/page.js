"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/lib/axios";
import Link from "next/link";

export default function UjianCBT() {
  const router = useRouter();
  
  // State Ujian
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  
  // State UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fungsi Fetch Ujian
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get("/exam/start");
        setQuestions(response.data.questions);
        setSessionId(response.data.session_id);
        setEndTime(response.data.end_time);
      } catch (error) {
        if (error.response?.status === 403) {
          // Jika ditolak karena sudah selesai atau waktu habis
          setIsFinished(true);
          setErrorMsg(error.response.data.msg);
        } else {
          setErrorMsg("Gagal memuat ujian. Pastikan akun Anda sudah diverifikasi.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchExam();
  }, []);

  // Fungsi Submit Ujian
  const submitExam = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post("/exam/finish", { sessionId });
      setIsFinished(true);
      setErrorMsg(""); // Bersihkan error jika sukses submit
    } catch (error) {
      alert(error.response?.data?.msg || "Gagal mengumpulkan ujian.");
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, isSubmitting]);

  // Fungsi Timer Mundur
  useEffect(() => {
    if (!endTime || isFinished) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00");
        submitExam(); // Waktu habis, kumpul otomatis!
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, isFinished, submitExam]);

  // Fungsi Pilih Jawaban (Auto-Save)
  const handleSelectOption = async (questionId, answerId, selectedOption) => {
    // 1. Update UI secara lokal (Biar snappy/cepat)
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].selected_option = selectedOption;
    setQuestions(updatedQuestions);

    // 2. Simpan ke Backend (Background process)
    try {
      await axios.post("/exam/answer", {
        answerId: answerId,
        selected_option: selectedOption
      });
    } catch (error) {
      console.error("Gagal auto-save:", error);
      // Kalau gagal save, mungkin waktu habis di server
    }
  };

  const handleFinishClick = () => {
    const confirmSubmit = window.confirm("Apakah Anda yakin ingin menyelesaikan ujian? Jawaban tidak dapat diubah lagi.");
    if (confirmSubmit) {
      submitExam();
    }
  };

  // --- RENDER LAYAR LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a2e1f] flex flex-col items-center justify-center text-[#c49a45]">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#c49a45] rounded-full animate-spin mb-4"></div>
        <p className="font-bold tracking-widest uppercase">Menyiapkan Enkripsi Soal...</p>
      </div>
    );
  }

  // --- RENDER LAYAR SELESAI / ERROR ---
  if (isFinished || errorMsg) {
    return (
      <div className="min-h-screen bg-[#e3e8e5] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border-t-8 border-[#2b4d33]">
          <div className="w-24 h-24 bg-[#eef2ef] text-[#2b4d33] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            {errorMsg ? "⚠️" : "✅"}
          </div>
          <h1 className="text-3xl font-black text-[#1a2e1f] mb-4">
            {errorMsg ? "Akses Ditolak" : "Ujian Selesai!"}
          </h1>
          <p className="text-[#4b5e51] font-medium mb-8">
            {errorMsg || "Terima kasih. Jawaban Anda telah direkam dengan aman ke dalam server. Silakan pantau pengumuman kelulusan di dasbor Anda."}
          </p>
          <Link href="/dashboard" className="inline-block px-8 py-4 bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-wider">
            Kembali ke Dasbor
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER LAYAR UJIAN UTAMA ---
  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#e3e8e5] text-[#1a2e1f] font-sans flex flex-col">
      {/* HEADER & TIMER (Sticky) */}
      <header className="bg-[#1a2e1f] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c49a45] rounded-full flex items-center justify-center font-black text-[#1a2e1f] border-2 border-white text-xs">
              CBT
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm">Tes Potensi Akademik</h1>
              <p className="text-xs text-[#a5baa9]">SMP Kartika Wirabuana 4</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#2b4d33] px-4 py-2 rounded-xl border border-[#4a7c59]">
            <span className="text-sm font-bold text-[#c49a45] uppercase tracking-wider">Sisa Waktu</span>
            <span className={`text-xl font-black font-mono ${timeLeft.startsWith("00") ? "text-red-400 animate-pulse" : "text-white"}`}>
              {timeLeft || "--:--"}
            </span>
          </div>
        </div>
      </header>

      {/* KONTEN UJIAN */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* KOLOM KIRI: AREA SOAL */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border-t-4 border-[#c49a45] flex-1">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
              <h2 className="text-xl font-black text-[#1a2e1f]">Soal Nomor {currentIndex + 1}</h2>
              <span className="bg-[#eef2ef] text-[#2b4d33] px-3 py-1 rounded-full text-xs font-bold">
                Pilihan Ganda
              </span>
            </div>
            
            {/* Teks Soal */}
            <div className="text-lg md:text-xl text-[#2b4d33] font-medium leading-relaxed mb-8">
              {currentQ?.question?.question_text}
            </div>

            {/* Opsi Jawaban */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optText = currentQ?.question[`opt_${opt.toLowerCase()}`];
                const isSelected = currentQ?.selected_option === opt;
                
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(currentQ?.question?.id, currentQ?.id, opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      isSelected 
                      ? "border-[#2b4d33] bg-[#eef2ef]" 
                      : "border-gray-200 hover:border-[#c49a45] hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-lg ${
                      isSelected ? "bg-[#2b4d33] text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {opt}
                    </div>
                    <span className={`font-medium ${isSelected ? "text-[#1a2e1f]" : "text-gray-700"}`}>
                      {optText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Navigasi Bawah */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-[#2b4d33] text-[#1a2e1f] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Soal Sebelumnya
            </button>
            
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleFinishClick}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#c49a45] hover:bg-[#b0883b] text-[#1a2e1f] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isSubmitting ? "Mengirim..." : "Selesaikan Ujian ✓"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-3 bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Soal Selanjutnya →
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: PALET NAVIGASI SOAL */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-[#2b4d33] sticky top-24">
            <h3 className="font-bold text-[#1a2e1f] mb-4 text-center uppercase tracking-widest border-b-2 border-gray-100 pb-2">
              Navigasi Soal
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((q, index) => {
                const isAnswered = q.selected_option !== null;
                const isActive = index === currentIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-full aspect-square flex items-center justify-center rounded-lg font-bold text-sm transition-all border-2 ${
                      isActive 
                        ? "border-[#c49a45] ring-2 ring-[#c49a45] ring-offset-1" // Highlight soal yg sedang dibuka
                        : isAnswered
                          ? "bg-[#2b4d33] text-white border-[#2b4d33]" // Hijau kalau sudah dijawab
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400" // Putih kalau belum
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Keterangan Warna */}
            <div className="space-y-2 text-xs font-medium text-gray-600 mb-6 border-t-2 border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#2b4d33] rounded"></div> <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div> <span>Belum Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#c49a45] rounded"></div> <span>Posisi Saat Ini</span>
              </div>
            </div>

            <button
              onClick={handleFinishClick}
              className="w-full py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all"
            >
              Kumpulkan Ujian
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}