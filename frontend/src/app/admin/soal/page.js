"use client";

import { useState, useEffect } from "react";
import axios from "@/app/lib/axios";

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

  if (isLoading) return <div className="animate-pulse text-center font-bold text-[#2b4d33] mt-20">Memuat Bank Soal...</div>;

  return (
    <div className="pb-10">
      <h2 className="text-3xl font-black text-[#1a2e1f] mb-2 uppercase">Bank Soal CBT</h2>
      <p className="text-[#4b5e51] mb-8 font-medium">Kelola daftar soal pilihan ganda untuk ujian calon siswa.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM TAMBAH SOAL */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-[#c49a45] sticky top-6">
            <h3 className="text-xl font-bold text-[#1a2e1f] mb-4">➕ Tambah Soal Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-1">Pertanyaan</label>
                <textarea 
                  name="question_text" 
                  value={formData.question_text} 
                  onChange={handleChange} 
                  required 
                  rows="4" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none text-sm"
                  placeholder="Tuliskan pertanyaan di sini..."
                ></textarea>
              </div>
              
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <span className="font-bold text-[#2b4d33] w-6">{opt}.</span>
                    <input 
                      type="text" 
                      name={`opt_${opt.toLowerCase()}`} 
                      value={formData[`opt_${opt.toLowerCase()}`]} 
                      onChange={handleChange} 
                      required 
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none text-sm"
                      placeholder={`Pilihan ${opt}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4b5e51] mb-1">Jawaban Benar</label>
                <select 
                  name="correct_answer" 
                  value={formData.correct_answer} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c49a45] outline-none font-bold text-[#2b4d33]"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-[#2b4d33] hover:bg-[#1a2e1f] text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 mt-4"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Soal"}
              </button>
            </form>
          </div>
        </div>

        {/* DAFTAR SOAL */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1a2e1f] text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <span className="font-bold">Total Soal di Database:</span>
            <span className="bg-[#c49a45] text-[#1a2e1f] px-4 py-1 rounded-full font-black">{questions.length}</span>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-3xl shadow text-gray-500 font-medium">
              Belum ada soal. Silakan tambahkan soal pertama di sebelah kiri.
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="bg-white p-6 rounded-3xl shadow border border-gray-100 relative group">
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all opacity-0 group-hover:opacity-100"
                  title="Hapus Soal"
                >
                  ✕
                </button>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#eef2ef] text-[#2b4d33] rounded-xl flex items-center justify-center font-black flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-[#1a2e1f] mb-4 pr-8">{q.question_text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {['A', 'B', 'C', 'D'].map(opt => {
                        const isCorrect = q.correct_answer === opt;
                        return (
                          <div key={opt} className={`p-3 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-500 font-bold text-green-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                            <span className={`mr-2 ${isCorrect ? 'text-green-600' : 'text-gray-400 font-bold'}`}>{opt}.</span> 
                            {q[`opt_${opt.toLowerCase()}`]}
                            {isCorrect && <span className="float-right text-green-600">✓ Benar</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}