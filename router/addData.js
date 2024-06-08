const express = require('express');
const router = express.Router();
const data = require('../controller/addDataController')
const upload = require('../middleware/uploadFile.js');

router.get('/add-data', data.viewpage);
router.post('/upload-data', upload.single('file'),data.uploadData);
router.get('/data-detail/:tgl/:nama_user/:unit', data.dataDetail);
router.delete('/delete-data/:tgl/:nama_user', data.deleteData);
router.post('/upload-akun', upload.single('file'), data.uploadakun)
module.exports = router;