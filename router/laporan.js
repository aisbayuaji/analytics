const express = require('express');
const router = express.Router();
const connection = require('../connection');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.use(cookieParser());

router.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

router.get('/laporan', async (req, res) => {
    const username = req.session.username;
    const jabatan = req.session.jabatan;
    const unit = req.session.unit;
  
    const currentDate = new Date();
    const bulanAwal = currentDate.getMonth() + 1; 
    const tahunAwal = currentDate.getFullYear(); 
    const bulanAkhir = currentDate.getMonth() + 1; 
    const tahunAkhir = currentDate.getFullYear(); 
  
    const kategori = 'Pinca';
    const keterangan = 'Simpanan';
  
    try {
      const query = `
        SELECT * 
        FROM data_report 
        WHERE (YEAR(tanggal_report) > ? OR (YEAR(tanggal_report) = ? AND MONTH(tanggal_report) >= ?))
          AND (YEAR(tanggal_report) < ? OR (YEAR(tanggal_report) = ? AND MONTH(tanggal_report) <= ?))
          AND kategori LIKE ?
          AND keterangan LIKE ?
      `;
      connection.query(query, [ tahunAwal, tahunAwal, bulanAwal, tahunAkhir, tahunAkhir, bulanAkhir, `%${kategori}%`, `%${keterangan}%`], (error, results) => {
        if(error) {
            res.status(500).send(error);
        }
        res.render('laporan', {
            layout: 'layout/layout',
            results,
            username:username,
            jabatan: jabatan,
            unit:unit
        })
    })
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data.');
    }
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

router.post('/laporan', async (req, res) => {
    
    const username = req.session.username;
    const jabatan = req.session.jabatan;
    const unit = req.session.unit;
    const { bulanAwal, tahunAwal, bulanAkhir, tahunAkhir, kategori, keterangan } = req.body;
  
    try {
      const query = `
        SELECT * 
        FROM data_report 
        WHERE (YEAR(tanggal_report) > ? OR (YEAR(tanggal_report) = ? AND MONTH(tanggal_report) >= ?))
          AND (YEAR(tanggal_report) < ? OR (YEAR(tanggal_report) = ? AND MONTH(tanggal_report) <= ?))
          AND kategori LIKE ?
          AND keterangan LIKE ?
      `;
      connection.query(query, [ tahunAwal, tahunAwal, bulanAwal, tahunAkhir, tahunAkhir, bulanAkhir, `%${kategori}%`, `%${keterangan}%`], (error, results) => {
        if(error) {
            res.status(500).send(error);
        }
        res.status(200).send(results);
    })
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data.');
    }
  });

module.exports = router;