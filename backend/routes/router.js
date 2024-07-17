const express = require('express');
const router = express.Router();
const Schemas = require('../models/schemas');
const userController = require('../controllers/userController');


router.post('/user',userController.dodaj);

module.exports = router;