ALUR SISTEM & LOGIKA BISNIS (WORKFLOW)

Sistem Penerimaan Peserta Didik Baru (PPDB) & CBT Online
Klien: Sekolah Menengah Pertama Kartika Wirabuana 4 Kota Manado
Tema UI/UX: Dominan Hijau (Military/Army Theme), Mobile-First Design.

1. FASE REGISTRASI & VERIFIKASI (PPDB)

Fase ini mengatur bagaimana calon siswa mendaftar dan menyerahkan berkas persyaratan secara digital.

Alur Calon Siswa:

Pembuatan Akun: Calon siswa membuat akun baru dan login menggunakan Email yang valid.

Pengisian Biodata & Nilai: Siswa mengisi formulir data diri lengkap dan menginputkan Nilai Rapor (sebagai salah satu komponen penilaian akhir).

Upload Berkas: Siswa mengunggah dokumen digital berupa:

Ijazah SD

Surat Keterangan Lulus (SKL)

Kartu Keluarga (KK)

Akta Kelahiran

Status: Akun masuk ke status “Menunggu Verifikasi”. Tombol Ujian CBT masih terkunci (disabled).

Alur Admin (Panitia):

Admin memeriksa keaslian berkas dan kesesuaian nilai rapor yang diinput siswa.

Jika tidak valid, Admin dapat menolak pendaftaran (berkas dikembalikan untuk diperbaiki).

Jika valid, Admin menekan tombol "Verifikasi". Akun siswa otomatis terbuka untuk mengakses Modul Ujian (CBT).

2. FASE UJIAN ONLINE (CBT - Computer Based Test)

Fase ini adalah inti pengujian calon siswa. Didesain dengan sistem keamanan dan kenyamanan mobile-friendly (karena 80% pengguna menggunakan HP).

Logika & Aturan Sistem:

Akses Ujian: Siswa yang sudah diverifikasi masuk ke menu Ujian dan menekan tombol "Mulai Tes".

Pengacakan Soal (Randomization): Sistem akan mengambil soal dari Bank Soal dan mengacak urutan soal beserta pilihan gandanya untuk setiap siswa (mencegah kecurangan).

Manajemen Waktu (Timer): Waktu ujian di-set fix 45 Menit. Timer berjalan di background server untuk mencegah siswa mencurangi waktu via browser.

Auto-Save & Retake (Koneksi Terputus): Setiap siswa menjawab 1 soal, jawaban langsung tersimpan ke server. Jika koneksi putus atau keluar dari browser, siswa dapat masuk kembali (retake/resume) dan melanjutkan sisa waktu ujian tanpa kehilangan jawaban sebelumnya.

Auto-Submit: Ketika waktu 45 menit habis, layar ujian akan terkunci otomatis dan seluruh jawaban akan terkirim (submit) ke server secara paksa tanpa perlu campur tangan siswa.

3. FASE PENILAIAN & PENGUMUMAN

Sistem penilaian dilakukan secara hybrid (Otomatis + Manual).

Logika Penilaian:

Sistem akan menghitung skor otomatis dari hasil CBT (Pilihan Ganda).

Sistem akan menggabungkan skor CBT dengan Nilai Rapor (bobot penilaian ditentukan kemudian).

Kerahasiaan Nilai: Skor akhir TIDAK AKAN ditampilkan kepada siswa setelah ujian selesai (skor bersifat rahasia/internal panitia).

Logika Kelulusan:

Admin meninjau skor akhir di Dashboard.

Admin menetapkan status akhir setiap siswa: "LULUS" atau "TIDAK LULUS".

Pada hari pengumuman yang ditetapkan, siswa login ke akun masing-masing dan hanya akan melihat layar interaktif dengan tulisan "LULUS" atau "TIDAK LULUS" (tanpa memunculkan angka nilai).

4. FITUR PELAPORAN (ADMIN)

Fase untuk kebutuhan administratif sekolah.

Dashboard Rekapitulasi: Admin dapat melihat grafik pendaftar, jumlah yang sudah ujian, dan jumlah yang lulus/tidak.

Export Data: Admin dapat mengunduh seluruh data pendaftar (biodata lengkap, nilai rapor, dan nilai CBT) ke dalam format Microsoft Excel (.xlsx) dan PDF untuk keperluan arsip sekolah.

Dokumen ini merupakan spesifikasi fungsional awal yang disepakati sebagai acuan utama dalam pengembangan sistem.