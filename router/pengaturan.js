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

router.get('/pengaturan', (req, res) => {
    const username = req.session.username;
    const jabatan = req.session.jabatan;
    const unit = req.session.unit;
    res.render('pengaturan', {
        layout: 'layout/layout',
        username:username,
        jabatan: jabatan,
        unit: unit
    })
})
router.post('/ubah-password', (req, res) => {
    const { password_lama, password_baru } = req.body;
    const username = req.session.username;
  console.log(username)
  
    connection.query('SELECT password FROM user WHERE username = ?', [username], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User tidak ditemukan.' });
      }

      const hashedPassword = results[0].password;

      bcrypt.compare(password_lama, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }

        if (!isMatch) {
          return res.status(400).json({ error: 'Password lama tidak sesuai.' });
        }

        bcrypt.hash(password_baru, 10, (err, newHashedPassword) => {
          if (err) {
            return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
          }
      
          connection.query('UPDATE user SET password = ? WHERE username = ?', [newHashedPassword, username], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
            }
      
            return res.json({ message: 'Password berhasil diubah.' });
          });
        });
      });
    });
  });

module.exports = router;