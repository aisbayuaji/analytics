const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth')
const env = dotenv.config().parsed
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const login = require('./router/login');
const home = require('./router/home');
const userdata = require('./router/dataUser');
const template = require('./router/dataAkun');
const unit = require('./router/unit');
const adddata = require('./router/addData');
const download = require('./router/download');
const laporan = require('./router/laporan');
const pengaturan = require('./router/pengaturan')

app.use(auth);
app.use('/', home)
app.use('/', login)
app.use('/', userdata)
app.use('/', template)
app.use('/', unit)
app.use('/', adddata)
app.use('/', download)
app.use('/', laporan)
app.use('/', pengaturan)

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error destroying session');
        return;
      }
      res.clearCookie('access_token');
      res.redirect('/login'); 
    });
});
  
app.use((req, res) => {
    res.status(404);
    const username = req.session.username;
    const jabatan = req.session.jabatan;
    const unit = req.session.unit;
    if (!username) {
      res.redirect('/login');
      return;
    }
    res.render('404', {
      layout: 'layout/layout',
      username:username,
      jabatan: jabatan, 
      unit: unit
  });
  });
  
app.listen(env.APP_PORT, () => {
    console.log('App berjalan di port 3000')
})