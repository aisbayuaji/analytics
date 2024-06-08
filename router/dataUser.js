const express = require('express');
const router = express.Router();
const userdata = require('../controller/userDataController')

router.get('/user-data', userdata.datauser);
router.post('/add-user', userdata.addUser);
router.delete('/delete-user/:id', userdata.deleteUser);
router.post('/edit-user/:id', userdata.editUser)

module.exports = router;
