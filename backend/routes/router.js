const express = require('express');
const router = express.Router();
const Schemas = require('../models/schemas');
const userController = require('../controllers/userController');


router.post('/user',userController.dodaj);
router.get('/userData',userController.data);

module.exports = router;