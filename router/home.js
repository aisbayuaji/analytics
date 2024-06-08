const express = require('express');
const router = express.Router();
const session = require('express-session');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const connection = require('../connection.js')

router.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));
router.get('/', async (req, res) => {
  const username = req.session.username;
  const jabatan = req.session.jabatan;
  const unit = req.session.unit;

  try {
    
    const tahunIni = new Date().getFullYear();
    const query1 = 'SELECT COUNT(*) FROM unit';
    const query2 = 'SELECT COUNT(*) FROM user';
    const query3 = 'SELECT COUNT(*) FROM daftar_upload';
    const query4 = 'SELECT COUNT(*) FROM kategori';
    const totalUnit = await new Promise((resolve, reject) => {
      connection.query(query1, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const totalUser = await new Promise((resolve, reject) => {
      connection.query(query2, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const totalData = await new Promise((resolve, reject) => {
      connection.query(query3, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const totalKategori = await new Promise((resolve, reject) => {
      connection.query(query4, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    let unitquery;
    
    if(jabatan != "Kaunit"){
      unitquery = 'select unit from unit';
    }else{
      unitquery = 'select unit from unit where unit=?';
    }
    
    const unitdata =  await new Promise((resolve, reject) => {
      connection.query(unitquery,[unit],(error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    res.render('index', {
      layout: 'layout/layout',
      username: username,
      jabatan: jabatan,
      unit: unit,
      totalUnit: totalUnit[0]['COUNT(*)'],
      totalUser: totalUser[0]['COUNT(*)'],
      totalData: totalData[0]['COUNT(*)'],
      totalKategori: totalKategori[0]['COUNT(*)'],
       tahunIni, unitdata
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data.');
  }
});



router.get('/dataChart/:unit', (req, res) => {
  const tahunIni = new Date().getFullYear();
  const query5 = 'SELECT unit, bulan, sum(saldo) as total_saldo, sum(rka) as total_rka FROM data WHERE unit = ? AND tahun=? GROUP BY bulan ORDER BY bulan';
  const unit = req.params.unit;
  connection.query(query5, [unit,tahunIni], (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Terjadi kesalahan saat mengambil data.' });
    } else {
      res.status(200).json(results);
    }
  });
});


router.get('/data-perbulan/:bulan/:unit', (req, res) =>{
  const bulan = req.params.bulan;
  const unit = req.params.unit;
  const tahunIni = new Date().getFullYear();

  const query5 = 'SELECT bulan, kategori, sum(rka) as total_rka, sum(saldo) as total_saldo, ((sum(saldo) / sum(rka)) * 100) as total_capai FROM data WHERE tahun=? and bulan=? and unit=?  GROUP BY kategori';
    
      connection.query(query5,[tahunIni, bulan, unit], (error, results) => {
        if (error) {
          reject(error);
        } else {
          res.status(200).send(results);
        }
      });
})
router.get('/laporan-detail/:bulan/:unit', async (req, res) => {
  try {
    const bulan = req.params.bulan;
    const unit = req.params.unit;
    const tahunIni = new Date().getFullYear();

    const queryTemplate = 'SELECT * FROM data WHERE bulan=? AND unit=?  AND tahun=?';
    const queryKategori = 'SELECT kategori FROM data WHERE bulan=? AND unit=?  AND tahun=? GROUP BY kategori';

    const template = await new Promise((resolve, reject) => {
      connection.query(queryTemplate, [bulan, unit, tahunIni], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const kategori = await new Promise((resolve, reject) => {
      connection.query(queryKategori, [bulan, unit, tahunIni], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const groupedData = {};
    kategori.forEach((item) => {
      if (!groupedData[item.kategori]) {
        groupedData[item.kategori] = [];
      }
      template.forEach((data) => {
        if (data.kategori === item.kategori && data.keterangan.trim() !== '') {
          groupedData[item.kategori].push([data.keterangan, data.saldo, data.rka, data.pencapaian]);
        }
      });
    });
    res.status(200).send(groupedData);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;