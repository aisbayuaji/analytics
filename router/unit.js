const express = require('express');
const router = express.Router();
const unitdata = require('../controller/unitController')

router.get('/data-unit', unitdata.dataUnit);
router.post('/add-unit', unitdata.addunit);
router.delete('/delete-unit/:id', unitdata.deleteunit)
router.get('/unit-all', unitdata.unitAll)

module.exports = router;
