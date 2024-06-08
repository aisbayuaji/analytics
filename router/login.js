const express = require('express');
const router = express.Router();
const prosesLogin = require('../controller/loginController')

router.get('/login', prosesLogin.login);
router.post('/login', prosesLogin.loginProses)

module.exports = router;
