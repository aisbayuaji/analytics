-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2024 at 11:42 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `analytics`
--

-- --------------------------------------------------------

--
-- Table structure for table `daftar_upload`
--

CREATE TABLE `daftar_upload` (
  `id` int(11) NOT NULL,
  `tgl` datetime NOT NULL DEFAULT current_timestamp(),
  `parent_user` varchar(100) NOT NULL,
  `nama_user` varchar(100) NOT NULL,
  `unit_upload` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daftar_upload`
--

INSERT INTO `daftar_upload` (`id`, `tgl`, `parent_user`, `nama_user`, `unit_upload`) VALUES
(8, '2024-05-16 03:12:20', '1', 'admin', 'Tes'),
(10, '2024-05-17 07:57:51', '1', 'admin', 'Tes');

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `id` int(11) NOT NULL,
  `tanggal` datetime NOT NULL DEFAULT current_timestamp(),
  `nama_user` varchar(100) NOT NULL,
  `unit` varchar(100) NOT NULL,
  `kategori` varchar(30) NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  `saldo` int(11) NOT NULL,
  `rka` varchar(100) NOT NULL,
  `pencapaian` varchar(11) NOT NULL,
  `bulan` varchar(13) NOT NULL,
  `tahun` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`id`, `tanggal`, `nama_user`, `unit`, `kategori`, `keterangan`, `saldo`, `rka`, `pencapaian`, `bulan`, `tahun`) VALUES
(73, '2024-05-16 03:12:20', 'admin', 'Tes', 'Asset', '', 0, '', '0', 'Mei', 2024),
(74, '2024-05-16 03:12:20', 'admin', 'Tes', 'Asset', 'Kas kecil', 134, '700', '0', 'Mei', 2024),
(75, '2024-05-16 03:12:20', 'admin', 'Tes', 'Asset', 'Setara Kas', 12, '12', '0', 'Mei', 2024),
(76, '2024-05-16 03:12:20', 'admin', 'Tes', 'Asset', 'Piutang', 33, '33', '0', 'Mei', 2024),
(77, '2024-05-16 03:12:20', 'admin', 'Tes', 'Liquiditas', '', 77, '100', '0', 'Mei', 2024),
(78, '2024-05-16 03:12:20', 'admin', 'Tes', 'Liquiditas', 'peralatan', 9, '20', '0', 'Mei', 2024),
(85, '2024-05-17 07:57:51', 'admin', 'Tes', 'Asset', '', 0, '', '', 'Juni', 2024),
(86, '2024-05-17 07:57:51', 'admin', 'Tes', 'Asset', 'Kas kecil', 0, '0', '0', 'Juni', 2024),
(87, '2024-05-17 07:57:51', 'admin', 'Tes', 'Asset', 'Setara Kas', 0, '0', '0', 'Juni', 2024),
(88, '2024-05-17 07:57:51', 'admin', 'Tes', 'Asset', 'Piutang', 0, '0', '0', 'Juni', 2024),
(89, '2024-05-17 07:57:51', 'admin', 'Tes', 'Liquiditas', '', 0, '', '', 'Juni', 2024),
(90, '2024-05-17 07:57:51', 'admin', 'Tes', 'Liquiditas', 'peralatan', 0, '0', '0', 'Juni', 2024);

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `kategori`) VALUES
(2, 'Asset'),
(3, 'Liquiditas');

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `akun` varchar(100) NOT NULL,
  `kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `template`
--

INSERT INTO `template` (`id`, `akun`, `kategori`) VALUES
(2, 'Kas kecil', 'Asset'),
(4, 'Setara Kas', 'Asset'),
(5, 'peralatan', 'Liquiditas'),
(6, 'Piutang', 'Asset');

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE `unit` (
  `id` int(11) NOT NULL,
  `unit` varchar(100) NOT NULL,
  `kode_unit` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`id`, `unit`, `kode_unit`) VALUES
(2, 'Tes', '123456'),
(3, 'Cek', '132');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `kode_user` varchar(30) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `jabatan` varchar(20) NOT NULL,
  `unit` varchar(30) NOT NULL,
  `parent` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `kode_user`, `username`, `password`, `jabatan`, `unit`, `parent`) VALUES
(1, '123', 'admin', '$2b$10$u795XomHMuPFpnFOMkJwaOLWJjmpis..k31nG06oZrsyoMG7s.PTC', 'Pinca', 'Tes', '1'),
(4, '122', 'cek', '$2b$10$eUH3nNLoJCNFqZQUHp2/7OuOQj87ETX6tVjiqVcqh4lvFGF2oOVfy', 'Kaunit', 'Cek', '1'),
(5, '33', 'mbm', '$2b$10$jyJ06pII/36dr.mwCCuBtOaxQw/Cu1P2g.r/T9PcIofx7RF0qnWqa', 'MBM', 'ALL', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daftar_upload`
--
ALTER TABLE `daftar_upload`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daftar_upload`
--
ALTER TABLE `daftar_upload`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
