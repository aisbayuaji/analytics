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

const dataUnit = async (req, res) => {
    const username = req.session.username;
    const jabatan = req.session.jabatan;
    const unit = req.session.unit;
    const query = 'select * from unit';
    connection.query(query, (error, results) => {
        if(error) {
            res.status(500).send(error);
        }
        res.render('data-unit', {
            layout: 'layout/layout',
            results,
            username:username,
            jabatan: jabatan,
            unit:unit
        })
    })
}
const unitAll = async (req, res) => {
    let query ='';
    query = 'select kategori from data_report GROUP BY kategori';
    
    connection.query(query, (error, results) => {
        if(error) {
            res.status(500).send(error);
        }
        
        res.status(200).send(results)
    })
}


const addunit = async (req, res) => {
    const {unit, kode_unit} = req.body;
    const query = 'insert into unit (unit, kode_unit) values (?,?)';
    connection.query(query, [unit, kode_unit], (error, results) =>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(results);
    })
}
const deleteunit = async (req, res) => {
    const id = req.params.id;
    const query = 'delete from unit where id=?';
    connection.query(query, [id], (error, results) =>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(results);
    })
}

module.exports = {dataUnit, addunit, deleteunit,unitAll}