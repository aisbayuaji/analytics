const express = require('express');
const route = express.Router();
const connection = require('../connection');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

route.use(cookieParser());

route.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const datakategori = async (req, res) => {
     const query = 'select * from kategori';
     connection.query(query, (error, results) => {
        if(error){
            res.status(500).send('Gagal memuat template')
        }
        res.status(200).send(results)

     })
}
const dataakun = async (req, res) => {
    const username = req.session.username;
     const jabatan = req.session.jabatan;
     const unit = req.session.unit;

     const query = 'select * from data_akun';
     connection.query(query, (error, results) => {
        if(error){
            res.status(500).send('Gagal memuat template')
        }
        res.render('kategori', {
            layout: 'layout/layout',
            results,
            username: username,
            jabatan: jabatan,
            unit: unit
        })

     })
}

const dataakunall = async (req, res) => {

     const query = 'select * from data_akun';
     connection.query(query, (error, results) => {
        if(error){
            res.status(500).send('Gagal memuat template')
        }
        res.status(200).send(results);
     })
}

const akunreport = async (req, res) => {

     const query = 'select * from data_report group by keterangan';
     connection.query(query, (error, results) => {
        if(error){
            res.status(500).send('Gagal memuat template')
        }
        res.status(200).send(results);
     })
}

const addAkun = async (req, res) => {
    const {akun, kategori} = req.body;
    const query = 'insert into template (akun, kategori) VALUES (?, ?)';
    connection.query(query,[akun, kategori], (error, results) => {
        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(results);
    })
}


const kategoriall = async (req, res) => {
    const username = req.session.username;
     const jabatan = req.session.jabatan;
     const unit = req.session.unit;

     const query = 'select * from kategori';
     connection.query(query, (error, results) => {
        if(error){
            res.status(500).send('Gagal memuat template')
        }
        res.render('kategori', {
            layout: 'layout/layout',
            results,
            username: username,
            jabatan: jabatan,
            unit: unit
        })

     })
}

const addKategori = async (req, res) => {
    const {kategori} = req.body;

    const query = 'insert into kategori (kategori) VALUES (?)';
    connection.query(query, [kategori], (error, results) => {
        if(error){
            res.status(error).send('Gagal menambahkan kategori');
        }
        res.status(200).send(results);
    })
}
const editKategori = async (req, res) => {
    const id = req.params.id;
    const {nama_kategori, pn, nama_pekerja, kode_uker, nama_uker} = req.body;
    const query = 'UPDATE data_akun SET nama_kategori=?, pn=?, nama_pekerja=?, kode_uker=?, nama_uker=? WHERE id=?';
    connection.query(query, [nama_kategori, pn,nama_pekerja,kode_uker, nama_uker, id], (error, results) =>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(results);
    })
}

const deleteKategori = async (req, res) => {
    const id = req.params.id;
    const query = 'Delete from data_akun where id=?';
    connection.query(query, [id], (error, results) => {
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(results);
    })
}
const deleteAkun = async (req, res) => {
    const id = req.params.id;
    const query = 'Delete from template where id=?';
    connection.query(query, [id], (error, results) => {
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(results);
    })
}
 const editAkun = async (req, res) => {
    const id = req.params.id;
    const {akun, kategori} = req.body;
    const query = 'update template set akun=?, kategori=? where id=?';
    connection.query(query, [akun, kategori, id], (error, results) => {
        if(error){
            res.status(500).send(error)
        }
        res.status(200).send(results);
    })
 }


 const akundata = async (req, res) => {
    const akun = req.params.akun;
    const jabatan = req.params.jabatan;
    const bulan1 = req.params.bulan1;
    const tahun1 = req.params.tahun1;
    const bulan2 = req.params.bulan2;
    const tahun2 = req.params.tahun2;

    const startDate = `${tahun1}-${bulan1.padStart(2, '0')}-01`;
    const endDate = `${tahun2}-${bulan2.padStart(2, '0')}-31`; 


    const query = 'SELECT * FROM data_report WHERE keterangan = ? AND kategori = ? AND tanggal_report >= ? AND tanggal_report < ? ORDER BY tanggal_report';

    connection.query(query, [akun, jabatan, startDate, endDate], (error, results) => {
        if (error) {
            res.status(500).send(error);
        }
        res.status(200).send(results);
    });
};

const prosesReport = async (req, res) => {

    const data1 = req.params.data1;
    const data2 = req.params.data2;
    const data3 = req.params.data3;
    const data4 = req.params.data4;
    const jabatan = req.params.jabatan;
    const bulan1 = req.params.bulan1;
    const tahun1 = req.params.tahun1;
    const bulan2 = req.params.bulan2;
    const tahun2 = req.params.tahun2;

    const startDate = `${tahun1}-${bulan1.padStart(2, '0')}-01`;
    const endDate = `${tahun2}-${bulan2.padStart(2, '0')}-31`; 

    const query = 'SELECT * FROM data_report WHERE keterangan IN (?, ?, ?, ?) AND kategori = ? AND tanggal_report >= ? AND tanggal_report <= ? ORDER BY tanggal_report';

    connection.query(query, [data1, data2, data3, data4, jabatan, startDate, endDate], (error, results) => {
        if (error) {
            res.status(500).send(error);
        }
        res.status(200).send(results);
    });
};



module.exports = {dataakun, addAkun, kategoriall, addKategori, editKategori, deleteKategori, datakategori, deleteAkun, editAkun, dataakunall,
    akunreport, akundata,prosesReport
};