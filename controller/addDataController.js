const express = require('express');
const route = express.Router();
const connection = require('../connection');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { readCSV, readExcel } = require('../middleware/filehandler');
const { error } = require('console');

route.use(cookieParser());

route.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const viewpage = async (req, res) => {
    const username = req.session.username;
    const jabatan = req.session.jabatan;
    const unit = req.session.unit;
    let query;
    query = 'select * from data_report';

    connection.query(query, (error, results) => {
      if(error){
        res.status(500).send(error);
      }
      res.render('add-data', {
        layout: 'layout/layout',
        username: username,
        jabatan: jabatan,
        unit: unit,
        results
  
      })
    })

}

const dataDetail = async(req, res)=>{
const tgl = req.params.tgl;
const nama_user = req.params.nama_user;
const unit = req.params.unit;

  const queryTemplate = 'SELECT * FROM data where  tanggal=? and nama_user=? and unit=?';
  const queryKategori = 'SELECT kategori FROM data where tanggal=? and nama_user=? and unit=? group by kategori';

    const template = await new Promise((resolve, reject) => {
        connection.query(queryTemplate,[tgl, nama_user, unit], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
    const kategori =  await new Promise((resolve, reject) => {
        connection.query(queryKategori,[tgl, nama_user, unit], (error, results) => {
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
                groupedData[item.kategori].push([data.keterangan, data.saldo]);
            }
        });
    });

        res.status(200).send(groupedData);
}


const uploadData = async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      let rows = [];
      if (file.originalname.endsWith('.csv')) {
        rows = await readCSV(file.path);
      } else if (file.originalname.endsWith('.xlsx')) {
        rows = await readExcel(file.path);
      } else {
        return res.status(400).send('Unsupported file format.');
      }
  
      let values = [];
      if (file.originalname.endsWith('.csv')) {
        values = rows.map(row => {
          const [tanggal_report,kategori, keterangan, posisi, rka, pencapaian] = row['Tanggal report;Kategori;Keterangan;RKA;Pencapaian'].split(';');
          return [tanggal_report,kategori, keterangan, posisi, rka, pencapaian];
        });
      } else if (file.originalname.endsWith('.xlsx')) {
        values = rows.map(row => {
          const [tanggal_report,kategori, keterangan, posisi, rka, pencapaian] = Object.values(row);
          return [tanggal_report,kategori, keterangan, posisi, rka, pencapaian];
        });
      }
      
      let query;
      query = `INSERT INTO data_report (tanggal_report, kategori, keterangan, posisi, rka, pencapaian) VALUES ?`;
      await connection.promise().query(query, [values.map(row => [...row])]);
   
  
      fs.unlinkSync(file.path);
  
      res.status(200).send({
        message: 'Upload successful'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file.');
    }
  };
  
  const deleteData = async (req, res) => {
    const tgl = req.params.tgl;
    const nama_user = req.params.nama_user;

    const query1 = 'delete from daftar_upload where tgl=? and nama_user=?';
    const query2 = 'delete from data where tanggal=? and nama_user=?';

    connection.query(query1, [tgl, nama_user], (error, results)=>{
      if(error){
        res.status(500).send(error);
      }
    })

    connection.query(query2, [tgl, nama_user], (error, results)=>{
      if(error){
        res.status(500).send(error);
      }
      res.status(200).send(results);
    })
    
  }


  const uploadakun = async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      let rows = [];
      if (file.originalname.endsWith('.csv')) {
        rows = await readCSV(file.path);
      } else if (file.originalname.endsWith('.xlsx')) {
        rows = await readExcel(file.path);
      } else {
        return res.status(400).send('Unsupported file format.');
      }
  
      let values = [];
      if (file.originalname.endsWith('.csv')) {
        values = rows.map(row => {
          const [NamaKategori,Pn, NamaPekerja, KodeUker, NamaUker] = row['Nama Kategori;PN;Nama Pekerja;Kode Uker; Nama Uker'].split(';');
          return [NamaKategori,Pn, NamaPekerja, KodeUker, NamaUker];
        });
      } else if (file.originalname.endsWith('.xlsx')) {
        values = rows.map(row => {
          const [NamaKategori,Pn, NamaPekerja, KodeUker, NamaUker] = Object.values(row);
          return [NamaKategori,Pn, NamaPekerja, KodeUker, NamaUker];
        });
      }
      
      query = `INSERT INTO data_akun (nama_kategori, pn, nama_pekerja, kode_uker, nama_uker) VALUES ?`;

      await connection.promise().query(query, [values.map(row => [...row])]);
  
      fs.unlinkSync(file.path);
  
      res.status(200).send({
        message: 'Upload successful'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file.');
    }
  };
  

module.exports = {viewpage, uploadData, dataDetail, deleteData, uploadakun};