const express = require('express');
const router = express.Router();
const akundata = require('../controller/dataAkunController');
const { dataUnit } = require('../controller/unitController');

router.get('/data-akun', akundata.dataakun);
router.post('/add-akun', akundata.addAkun);
router.get('/kategori-akun', akundata.dataakun);
router.post('/add-kategori', akundata.addKategori);
router.post('/edit-kategori/:id', akundata.editKategori);
router.delete('/delete-kategori/:id', akundata.deleteKategori);
router.get('/data-kategori', akundata.datakategori);
router.delete('/delete-akun/:id', akundata.deleteAkun);
router.post('/edit-akun/:id', akundata.editAkun);
router.get('/data-akunall', akundata.dataakunall);
router.get('/akun-report', akundata.akunreport)
router.get('/proses-report/:akun/:jabatan/:bulan1/:tahun1/:bulan2/:tahun2', akundata.akundata);
router.get('/proses-report2/:data1/:data2/:data3/:data4/:jabatan/:bulan1/:tahun1/:bulan2/:tahun2', akundata.prosesReport);


module.exports = router;
