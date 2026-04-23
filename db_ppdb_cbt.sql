-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table db_ppdb_cbt.documents
DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc_type` enum('ijazah','skl','kk','akte') NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.documents: ~15 rows (approximately)
INSERT INTO `documents` (`id`, `doc_type`, `file_path`, `studentId`, `createdAt`, `updatedAt`) VALUES
	(1, 'kk', 'http://localhost:5000/documents/1_kk_1773252123905.png', 1, '2026-03-11 17:54:38', '2026-03-11 18:02:03'),
	(2, 'ijazah', 'http://localhost:5000/documents/1_ijazah_1773252123886.png', 1, '2026-03-11 18:01:38', '2026-03-11 18:02:03'),
	(3, 'skl', 'http://localhost:5000/documents/1_skl_1773252123896.png', 1, '2026-03-11 18:02:03', '2026-03-11 18:02:03'),
	(4, 'akte', 'http://localhost:5000/documents/1_akte_1773258131773.png', 1, '2026-03-11 18:02:03', '2026-03-11 19:42:11'),
	(5, 'ijazah', 'http://localhost:5000/documents/7_ijazah_1773288019934.png', 7, '2026-03-12 04:00:19', '2026-03-12 04:00:19'),
	(6, 'skl', 'http://localhost:5000/documents/7_skl_1773288019944.png', 7, '2026-03-12 04:00:19', '2026-03-12 04:00:19'),
	(7, 'kk', 'http://localhost:5000/documents/7_kk_1773288019951.png', 7, '2026-03-12 04:00:19', '2026-03-12 04:00:19'),
	(8, 'akte', 'http://localhost:5000/documents/7_akte_1773288019957.png', 7, '2026-03-12 04:00:19', '2026-03-12 04:00:19'),
	(9, 'ijazah', 'http://localhost:5000/documents/6_ijazah_1773296071040.png', 6, '2026-03-12 06:14:31', '2026-03-12 06:14:31'),
	(10, 'skl', 'http://localhost:5000/documents/6_skl_1773296071050.png', 6, '2026-03-12 06:14:31', '2026-03-12 06:14:31'),
	(11, 'kk', 'http://localhost:5000/documents/6_kk_1773296071056.png', 6, '2026-03-12 06:14:31', '2026-03-12 06:14:31'),
	(12, 'akte', 'http://localhost:5000/documents/6_akte_1773296071062.png', 6, '2026-03-12 06:14:31', '2026-03-12 06:14:31'),
	(13, 'ijazah', 'http://localhost:5000/documents/9_ijazah_1774432696541.png', 9, '2026-03-25 09:58:16', '2026-03-25 09:58:16'),
	(14, 'skl', 'http://localhost:5000/documents/9_skl_1774432696559.png', 9, '2026-03-25 09:58:16', '2026-03-25 09:58:16'),
	(15, 'kk', 'http://localhost:5000/documents/9_kk_1774432696566.png', 9, '2026-03-25 09:58:16', '2026-03-25 09:58:16'),
	(16, 'akte', 'http://localhost:5000/documents/9_akte_1774432696573.png', 9, '2026-03-25 09:58:16', '2026-03-25 09:58:16');

-- Dumping structure for table db_ppdb_cbt.exam_answers
DROP TABLE IF EXISTS `exam_answers`;
CREATE TABLE IF NOT EXISTS `exam_answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `selected_option` enum('A','B','C','D') DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT '0',
  `sessionId` int NOT NULL,
  `questionId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionId` (`sessionId`),
  KEY `questionId` (`questionId`),
  CONSTRAINT `exam_answers_ibfk_3` FOREIGN KEY (`sessionId`) REFERENCES `exam_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `exam_answers_ibfk_4` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.exam_answers: ~28 rows (approximately)
INSERT INTO `exam_answers` (`id`, `selected_option`, `is_correct`, `sessionId`, `questionId`, `createdAt`, `updatedAt`) VALUES
	(1, 'A', 1, 1, 2, '2026-03-11 18:45:44', '2026-03-11 18:47:29'),
	(2, 'A', 1, 1, 3, '2026-03-11 18:45:44', '2026-03-11 18:47:47'),
	(3, 'A', 0, 1, 4, '2026-03-11 18:45:44', '2026-03-11 18:47:59'),
	(4, 'A', 1, 1, 1, '2026-03-11 18:45:44', '2026-03-11 18:48:05'),
	(5, 'A', 1, 2, 3, '2026-03-11 19:50:37', '2026-03-11 19:50:51'),
	(6, 'B', 1, 2, 4, '2026-03-11 19:50:37', '2026-03-11 19:50:56'),
	(7, 'A', 1, 2, 1, '2026-03-11 19:50:37', '2026-03-11 19:51:06'),
	(8, 'A', 1, 2, 2, '2026-03-11 19:50:37', '2026-03-11 19:51:09'),
	(9, 'B', 1, 3, 4, '2026-03-12 04:01:29', '2026-03-12 04:01:37'),
	(10, 'B', 0, 3, 1, '2026-03-12 04:01:29', '2026-03-12 04:04:30'),
	(11, 'B', 0, 3, 3, '2026-03-12 04:01:29', '2026-03-12 04:04:34'),
	(12, 'B', 0, 3, 2, '2026-03-12 04:01:29', '2026-03-12 04:04:36'),
	(13, 'B', 1, 4, 4, '2026-03-12 06:15:09', '2026-03-12 06:15:14'),
	(14, 'A', 1, 4, 3, '2026-03-12 06:15:09', '2026-03-12 06:15:18'),
	(16, 'A', 1, 4, 2, '2026-03-12 06:15:09', '2026-03-12 06:15:34'),
	(17, 'D', 0, 4, 1, '2026-03-12 06:15:09', '2026-03-12 06:15:49'),
	(18, 'A', 1, 5, 2, '2026-03-12 14:28:14', '2026-03-12 14:28:40'),
	(19, 'D', 0, 5, 4, '2026-03-12 14:28:14', '2026-03-12 14:28:43'),
	(20, 'C', 0, 5, 3, '2026-03-12 14:28:14', '2026-03-12 14:28:45'),
	(21, 'B', 0, 5, 1, '2026-03-12 14:28:14', '2026-03-12 14:28:47'),
	(22, 'A', 1, 6, 3, '2026-03-25 10:00:12', '2026-03-25 10:00:31'),
	(23, 'A', 1, 6, 2, '2026-03-25 10:00:12', '2026-03-25 10:00:36'),
	(24, 'A', 1, 6, 1, '2026-03-25 10:00:12', '2026-03-25 10:00:41'),
	(25, 'B', 1, 6, 4, '2026-03-25 10:00:12', '2026-03-25 10:00:43'),
	(26, 'A', 1, 7, 1, '2026-03-26 06:39:52', '2026-03-26 06:40:09'),
	(27, 'A', 1, 7, 3, '2026-03-26 06:39:52', '2026-03-26 06:41:03'),
	(28, 'C', 0, 7, 2, '2026-03-26 06:39:52', '2026-03-26 06:41:05'),
	(29, 'B', 1, 7, 4, '2026-03-26 06:39:52', '2026-03-26 06:41:06');

-- Dumping structure for table db_ppdb_cbt.exam_sessions
DROP TABLE IF EXISTS `exam_sessions`;
CREATE TABLE IF NOT EXISTS `exam_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_finished` tinyint(1) DEFAULT '0',
  `cbt_score` float DEFAULT '0',
  `studentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `exam_sessions_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.exam_sessions: ~7 rows (approximately)
INSERT INTO `exam_sessions` (`id`, `start_time`, `end_time`, `is_finished`, `cbt_score`, `studentId`, `createdAt`, `updatedAt`) VALUES
	(1, '2026-03-11 18:45:44', '2026-03-11 19:30:44', 1, 75, 1, '2026-03-11 18:45:44', '2026-03-11 18:48:16'),
	(2, '2026-03-11 19:50:37', '2026-03-11 20:35:37', 1, 100, 3, '2026-03-11 19:50:37', '2026-03-11 19:51:13'),
	(3, '2026-03-12 04:01:29', '2026-03-12 04:46:29', 1, 25, 7, '2026-03-12 04:01:29', '2026-03-12 04:04:44'),
	(4, '2026-03-12 06:15:09', '2026-03-12 07:00:09', 1, 80, 6, '2026-03-12 06:15:09', '2026-03-12 06:15:52'),
	(5, '2026-03-12 14:28:14', '2026-03-12 15:13:14', 1, 25, 8, '2026-03-12 14:28:14', '2026-03-12 14:28:51'),
	(6, '2026-03-25 10:00:12', '2026-03-25 10:45:12', 1, 100, 9, '2026-03-25 10:00:12', '2026-03-25 10:01:29'),
	(7, '2026-03-26 06:39:52', '2026-03-26 07:24:52', 1, 75, 5, '2026-03-26 06:39:52', '2026-03-26 06:41:41');

-- Dumping structure for table db_ppdb_cbt.parents
DROP TABLE IF EXISTS `parents`;
CREATE TABLE IF NOT EXISTS `parents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_name` varchar(255) NOT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `personal_email` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `relationship` enum('Ayah','Ibu','Wali') NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.parents: ~7 rows (approximately)
INSERT INTO `parents` (`id`, `parent_name`, `place_of_birth`, `date_of_birth`, `phone`, `personal_email`, `occupation`, `relationship`, `userId`, `createdAt`, `updatedAt`) VALUES
	(1, 'Budi Santoso', 'Padang', '1980-03-20', '081298765432', 'budisantoso@gmail.com', 'Wiraswasta', 'Ayah', 1, '2026-03-11 17:37:58', '2026-03-11 17:37:58'),
	(2, 'Rina Sari', 'Bandung', '1985-02-10', '081299887766', 'rinasari@gmail.com', 'Guru', 'Ibu', 3, '2026-03-11 18:35:19', '2026-03-11 18:35:19'),
	(3, 'Joko Santoso', 'Surabaya', '1975-12-15', '082345678901', 'jokosantoso@gmail.com', 'PNS', 'Ayah', 4, '2026-03-11 18:36:07', '2026-03-11 18:36:07'),
	(4, 'Bapak Testing', 'Minahasa', '1980-01-01', '089999999', 'ortu@test.com', 'PNS', 'Ayah', 5, '2026-03-11 18:57:01', '2026-03-11 18:57:01'),
	(5, 'test wali', 'jawa', '1990-01-31', '09213712367123', 'contohwali@gmail.com', 'PNS', 'Wali', 6, '2026-03-11 19:29:35', '2026-03-11 19:29:35'),
	(6, 'test', 'test', '2009-06-19', '089876543212', 'testorangtua2@gmail.com', 'PNS', 'Ibu', 7, '2026-03-12 03:59:33', '2026-03-12 03:59:33'),
	(7, 'John', 'Tomhoon', '2026-03-05', '08965666223', 'asdasdsad@gmail.com', 'PNS', 'Ayah', 8, '2026-03-12 05:42:38', '2026-03-12 05:42:38'),
	(8, 'Testing', 'Surabaya', '2026-03-11', '028975421212', '', 'PNS', 'Ibu', 9, '2026-03-25 09:57:10', '2026-03-25 09:57:10');

-- Dumping structure for table db_ppdb_cbt.questions
DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` text NOT NULL,
  `opt_a` varchar(255) NOT NULL,
  `opt_b` varchar(255) NOT NULL,
  `opt_c` varchar(255) NOT NULL,
  `opt_d` varchar(255) NOT NULL,
  `correct_answer` enum('A','B','C','D') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.questions: ~4 rows (approximately)
INSERT INTO `questions` (`id`, `question_text`, `opt_a`, `opt_b`, `opt_c`, `opt_d`, `correct_answer`, `createdAt`, `updatedAt`) VALUES
	(1, 'Siapakah penemu mesin uap?', 'James Watt', 'Thomas Edison', 'Albert Einstein', 'Nikola Tesla', 'A', '2026-03-11 18:40:39', '2026-03-11 18:40:39'),
	(2, 'Siapakah penemu lampu pijar?', 'Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Michael Faraday', 'A', '2026-03-11 18:40:51', '2026-03-11 18:40:51'),
	(3, 'Di manakah lokasi Menara Eiffel?', 'Paris, Prancis', 'London, Inggris', 'New York, Amerika Serikat', 'Tokyo, Jepang', 'A', '2026-03-11 18:40:56', '2026-03-11 18:40:56'),
	(4, 'Siapakah yang menemukan teori relativitas?', 'Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Marie Curie', 'B', '2026-03-11 18:41:02', '2026-03-11 18:41:02');

-- Dumping structure for table db_ppdb_cbt.students
DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `address` text,
  `phone` varchar(255) DEFAULT NULL,
  `origin_school` varchar(255) DEFAULT NULL,
  `report_score` float DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `graduation_status` enum('waiting','passed','failed') DEFAULT 'waiting',
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.students: ~8 rows (approximately)
INSERT INTO `students` (`id`, `full_name`, `place_of_birth`, `date_of_birth`, `gender`, `address`, `phone`, `origin_school`, `report_score`, `verification_status`, `graduation_status`, `userId`, `createdAt`, `updatedAt`) VALUES
	(1, 'John Doe', 'Manado', '2001-02-03', 'Laki-laki', 'Malalayang, Manado', '081234567890', 'SMP Negeri 12 Manado', NULL, 'verified', 'waiting', 1, '2026-03-11 17:37:58', '2026-03-11 17:37:58'),
	(3, 'Siti Aisyah', 'Jakarta', '2007-09-25', 'Perempuan', 'Jl. Raya Jakarta No. 45', '082112233445', 'SMP Negeri 4 Jakarta', NULL, 'verified', 'passed', 3, '2026-03-11 18:35:19', '2026-03-11 20:09:21'),
	(4, 'Admin', 'Bandung', '1990-07-30', 'Laki-laki', 'Jl. Raya Admin No. 10', '085112233445', 'Admin School', NULL, 'pending', 'waiting', 4, '2026-03-11 18:36:07', '2026-03-11 18:36:07'),
	(5, 'Siswa Testing', 'Manado', '2010-05-15', 'Laki-laki', 'Jl. Kairagi I Kombos', '08123456789', 'SD Negeri 1 Manado', 88.5, 'verified', 'waiting', 5, '2026-03-11 18:57:01', '2026-03-26 06:39:35'),
	(6, 'testsiswa', 'Tomohon', '2004-01-01', 'Laki-laki', 'test alamat', '098765432211', 'sdn 2 manado', 79.49, 'verified', 'passed', 6, '2026-03-11 19:29:35', '2026-03-12 06:16:55'),
	(7, 'testsiswa2', 'test', '2020-07-07', 'Laki-laki', 'test', '098765432134', 'test', 59, 'verified', 'waiting', 7, '2026-03-12 03:59:33', '2026-03-12 04:00:53'),
	(8, 'testsiswa3', 'Manado', '2011-02-11', 'Perempuan', 'Manado', '09876543221122', 'Manado', 65, 'verified', 'waiting', 8, '2026-03-12 05:42:38', '2026-03-12 14:27:47'),
	(9, 'calonsiswa1', 'testing', '2025-12-19', 'Laki-laki', 'Manado', '089580357412', 'Manado', 78, 'verified', 'passed', 9, '2026-03-25 09:57:10', '2026-03-26 06:36:51');

-- Dumping structure for table db_ppdb_cbt.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','siswa') NOT NULL DEFAULT 'siswa',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_ppdb_cbt.users: ~7 rows (approximately)
INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
	(1, 'aff9ebee-ba74-4609-ba62-7bc559c4dbc1', 'John Doe', 'johndoe@gmail.com', '$2b$10$.TFvOUC.v4pY2iTKEBXjGO0BXQpr8iJvv/Fd2abTL8UuhD5U3N0xi', 'siswa', '2026-03-11 17:37:58', '2026-03-11 17:37:58'),
	(3, '9d3b4966-9e4e-480b-bac9-4bc88828e38d', 'Siti Aisyah', 'sitiaisyah@gmail.com', '$2b$10$tb1pon7UHJ3exr5xqaF5yOMs/zm7VzvkMtQYM50DvS6pbi0Wks1R6', 'siswa', '2026-03-11 18:35:19', '2026-03-11 18:35:19'),
	(4, 'dba15615-39fc-4d04-9cd5-6d2671ac27af', 'Admin', 'admin@gmail.com', '$2b$10$sUVJjSJTnLeGm6Euczr09uwPXEbPNhmJTnmcR0f3HfvDim8eCcOsO', 'admin', '2026-03-11 18:36:07', '2026-03-11 18:36:07'),
	(5, '8fc806a2-a40e-4ea7-a982-b97785ebf969', 'Siswa Testing', 'siswa@test.com', '$2b$10$A9K3yYDP2Sbx9u49O5p7juOw08uojRe9/9XbjDf1kGbEZrmRca7yq', 'siswa', '2026-03-11 18:57:01', '2026-03-11 18:57:01'),
	(6, 'f9e992d5-7f94-4926-9368-9c8e1aff942a', 'testsiswa', 'testsiswa@gmail.com', '$2b$10$wYjOR5atvChm/ZqcifRl7eksljihc1rgqz2q7t0DLdx.df7AGJley', 'siswa', '2026-03-11 19:29:35', '2026-03-11 19:29:35'),
	(7, '82af601b-752e-4400-bd0d-8f1beaa80cf9', 'testsiswa2', 'testsiswa2@gmail.com', '$2b$10$myFDiY.XwdejVbQZ2ct1YOUnBmuV9TPHA1nE8mEHcG0IT4PQvvVVG', 'siswa', '2026-03-12 03:59:33', '2026-03-12 03:59:33'),
	(8, '0229cebc-2989-4411-87d5-9279cbe88b3a', 'testsiswa3', 'testsiswa3@gmail.com', '$2b$10$IjTz073zAze./YRPoV4nseFfsbgFK20VZD3cGO7ySaZbNNj6.jcR6', 'siswa', '2026-03-12 05:42:38', '2026-03-12 05:42:38'),
	(9, 'bad3fa31-043d-483a-b14e-11d36d0799cb', 'calonsiswa1', 'calonsiswa@gmail.com', '$2b$10$kFCvjwgV0rSRgRVSoU0JiOh.ZY5zJHIgYpHncWOmrPYRRGzrl1eTm', 'siswa', '2026-03-25 09:57:10', '2026-03-25 09:57:10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
