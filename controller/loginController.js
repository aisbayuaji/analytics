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

const login = (req, res) => {
  res.render('login', {
    layout: 'layout/layoutLogin'
  })
};

const loginProses = async (req, res) => {
  const { username, password } = req.body;

  try {
    const getUserQuery = 'SELECT * FROM user WHERE username = ?';
    connection.query(getUserQuery, [username], async (error, results) => {
      if (error) {
        console.error('Error retrieving user:', error);
        res.status(500).send('Error retrieving user');
        return;
      }

      if (results.length === 0) {
        res.status(403).redirect('/login?message=Pengguna tidak ditemukan');
        return;
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        res.status(401).redirect('/login?message=Password salah!');
        return;
      }
      req.session.username = user.username;
      req.session.jabatan = user.jabatan;
      req.session.unit = user.unit;
      req.session.parent = user.parent;
      req.session.id = user.kode_user;
      req.session.kodeuser = user.id_user;
    
      const accessToken = await jwt.sign({user_id: user.id_user}, 
        env.accesstoken, {expiresIn: env.timeToken});
      res.cookie('access_token', accessToken, { maxAge: 3600000, httpOnly: true });

      res.redirect('/');
    });
  } catch (error) {
    console.error('Error comparing passwords or retrieving user:', error);
    res.status(500).send('Error comparing passwords or retrieving user');
  }
};

module.exports = {login, loginProses};
