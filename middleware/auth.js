const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const route = express.Router();
const publicRoutes = ["/login"];

route.use(cookieParser());
dotenv.config();
const authenticateJWT = (req, res, next) => {
    if (publicRoutes.includes(req.path)) {
        return next();
      }
    const token = req.cookies.access_token;
    if (!token) {
        res.redirect('/login');
        return;
       
    }
    
    try {
        const decoded = jwt.verify(token, process.env.accesstoken);
        req.user = decoded;
        next();
    }catch(error) {
        return res.redirect("/login");
    }
};

module.exports = authenticateJWT;
