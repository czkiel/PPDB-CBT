"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";
import { PlusCircle, Trash2, CheckCircle2, ListTodo, Search, Loader2, BookOpen } from "lucide-react";

export default function BankSoalAdmin() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question_text: "",
    opt_a: "",
    opt_b: "",
    opt_c: "",
    opt_d: "",
    correct_answer: "A"
  });

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Gagal mengambil data soal", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/questions", formData);
      alert("Soal berhasil ditambahkan!");
      setFormData({
        question_text: "",
        opt_a: "",
        opt_b: "",
        opt_c: "",
        opt_d: "",
        correct_answer: "A"
      });
      fetchQuestions(); // Refresh daftar soal
    } catch (error) {
      alert("Gagal menambahkan soal: " + (error.response?.data?.msg || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus soal ini?")) {
      try {
        await axios.delete(`/questions/${id}`);
        fetchQuestions(); // Refresh setelah dihapus
      } catch (error) {
        alert("Gagal menghapus soal.");
      }
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 text-[#2b4d33] animate-spin" />
      <p className="font-bold text-[#1a2e1f] text-lg animate-pulse">Memuat Bank Soal...</p>
    </div>
  );

  return (
    <div className="pb-10 animate-fade-in">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2e1f] mb-2 uppercase tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#c49a45]" />
            Bank Soal CBT
          </h2>
          <p className="text-[#4b5e51] font-medium text-lg">Kelola daftar soal pilihan ganda untuk ujian calon siswa.</p>
        </div>
        <div className="bg-[#1a2e1f] text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg shadow-[#1a2e1f]/20 transition-transform hover:-translate-y-1">
          <ListTodo className="w-5 h-5 text-[#c49a45]" />
          <span className="font-bold">Total Soal:</span>
          <span className="bg-[#c49a45] text-[#1a2e1f] px-4 py-1 rounded-full font-black text-lg">{questions.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM TAMBAH SOAL */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border-t-4 border-[#c49a45] sticky top-6 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f4f5f0] rounded-xl">
                <PlusCircle className="w-6 h-6 text-[#2b4d33]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e1f]">Tambah Soal Baru</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Pertanyaan</label>
                <textarea 
                  name="question_text" 
                  value={formData.question_text} 
                  onChange={handleChange} 
                  required 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#c49a45] focus:ring-4 focus:ring-[#c49a45]/10 outline-none text-sm transition-all duration-300 resize-none font-medium text-[#1a2e1f]"
                  placeholder="Tuliskan pertanyaan di sini..."
                ></textarea>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#4b5e51]">Pilihan Jawaban</label>
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <div key={opt} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f5f0] flex items-center justify-center font-bold text-[#2b4d33] group-hover:bg-[#2b4d33] group-hover:text-white transition-colors">
                      {opt}
                    </div>
                    <input 
                      type="text" 
                      name={`opt_${opt.toLowerCase()}`} 
                      value={formData[`opt_${opt.toLowerCase()}`]} 
                      onChange={handleChange} 
                      required 
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#c49a45] focus:ring-4 focus:ring-[#c49a45]/10 outline-none text-sm transition-all duration-300 font-medium text-[#1a2e1f]"
                      placeholder={`Masukkan pilihan ${opt}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-2">Jawaban Benar</label>
                <div className="relative">
                  <select 
                    name="correct_answer" 
                    value={formData.correct_answer} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#2b4d33] focus:ring-4 focus:ring-[#2b4d33]/10 outline-none font-bold text-[#2b4d33] appearance-none transition-all duration-300 cursor-pointer"
                  >
                    <option value="A">Pilihan A</option>
                    <option value="B">Pilihan B</option>
                    <option value="C">Pilihan C</option>
                    <option value="D">Pilihan D</option>
                  </select>
                  <CheckCircle2 className="w-5 h-5 text-[#2b4d33] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 mt-2 bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-[#2b4d33]/30 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    Simpan Soal
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* DAFTAR SOAL */}
        <div className="lg:col-span-8 space-y-6">
          {questions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl shadow-xl shadow-gray-200/50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 transition-all hover:border-[#c49a45]/50">
              <div className="w-20 h-20 bg-[#f4f5f0] rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-[#4b5e51]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e1f]">Belum Ada Soal</h3>
              <p className="text-[#4b5e51] font-medium max-w-sm flex-wrap text-wrap">Bank soal masih kosong. Silakan tambahkan soal pertama Anda menggunakan form di samping.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl shadow-gray-100 border border-gray-100 relative group transition-all duration-300 hover:-translate-y-1">
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="absolute top-6 right-6 p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-red-500/20"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-14 h-14 bg-[#f4f5f0] text-[#1a2e1f] rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 border-2 border-[#eef2ef] group-hover:border-[#c49a45] group-hover:bg-[#c49a45]/10 group-hover:text-[#c49a45] transition-all duration-300">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg md:text-xl font-bold text-[#1a2e1f] mb-6 pr-12 leading-relaxed">{q.question_text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {['A', 'B', 'C', 'D'].map(opt => {
                          const isCorrect = q.correct_answer === opt;
                          return (
                            <div key={opt} className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-start gap-3 ${
                              isCorrect 
                                ? 'bg-[#2b4d33]/5 border-[#2b4d33] shadow-sm' 
                                : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}>
                              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                isCorrect 
                                  ? 'bg-[#2b4d33] text-white' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {opt}
                              </span> 
                              <span className={`flex-1 pt-1 font-medium ${isCorrect ? 'text-[#1a2e1f]' : 'text-gray-600'}`}>
                                {q[`opt_${opt.toLowerCase()}`]}
                              </span>
                              {isCorrect && (
                                <CheckCircle2 className="w-5 h-5 text-[#2b4d33] flex-shrink-0 mt-1" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}