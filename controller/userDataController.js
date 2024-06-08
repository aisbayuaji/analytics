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

const datauser = async (req, res) => {
    const unit = req.session.unit;
    const jabatan = req.session.jabatan;
    const username = req.session.username;
    const parent = req.session.parent;
    const idku = req.session.kodeuser;
  
        const query = 'Select * from user where parent=?';

        connection.query(query,[idku], (error, results) => {
            if(error){
                res.status(500).send('Gagak mengambil data')
            }
            res.render('data-user', {
                layout: 'layout/layout',
                results,
                username: username,
                unit: unit,
                jabatan: jabatan
            })

        })
    
}

const addUser = async (req, res) => {
    const parent = req.session.parent;
    const { kode_user, username, jabatan, password } = req.body;
    try {
      const usernameExistsQuery = 'SELECT COUNT(*) AS count FROM user WHERE username = ?';
      connection.query(usernameExistsQuery, [username], async (error, results) => {
        if (error) {
          console.error('Error checking username existence:', error);
          res.status(500).send('Error Checking Username Existence');
          return;
        }
  
        if (results[0].count > 0) {
          res.status(400).send('Username already exists');
          return;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
  
        const insertUserQuery = 'INSERT INTO user (kode_user, username, jabatan,  password, parent) VALUES (?, ?,  ?, ?,?)';
        connection.query(insertUserQuery, [kode_user,username, jabatan, hashedPassword,parent], (error, results) => {
          if (error) {
            console.error('Error creating user:', error); 
            res.status(500).send('Error Creating User');
            return;
          }
          res.status(200).send(results); 
        });
      });
    } catch (error) {
      console.error('Error hashing password or checking username:', error);
      res.status(500).send('Error Hashing Password or Checking Username');
    }
  };
  const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const deleteQuery = 'DELETE FROM user WHERE id_user = ?';
      connection.query(deleteQuery, [userId], (error, results) => {
        if (error) {
          console.error('Error deleting user:', error);
          res.status(500).send('Error deleting user');
          return;
        }
  
        res.status(200).send(results);
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Error deleting user');
    }
  };
  
  
const editUser = async (req, res) => {
    const id_user = req.params.id;
    const { id, kode_user, username, jabatan} = req.body;
    try {
      const queryEdit = 'UPDATE user SET kode_user=?, username = ?, jabatan = ?, WHERE id_user = ?';
      connection.query(queryEdit, [kode_user,username, jabatan, id_user], (error, results) => {
        if (error) {
          console.error('Error updating user:', error);
          res.status(500).send('Error updating user');
          return;
        }
        res.status(200).send(results);
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Error updating user');
    }
  };

module.exports = {datauser, addUser, deleteUser, editUser};