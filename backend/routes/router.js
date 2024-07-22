const express = require('express');
const router = express.Router();
const Schemas = require('../models/schemas');
const userController = require('../controllers/userController');
const priceController = require('../controllers/priceController');

router.delete('/user/:id', userController.usun);
router.post('/user',userController.dodaj);
router.get('/userData',userController.data);
router.post('/addPrice',priceController.dodajCene);
router.get('/getPrice',priceController.dataPrice);

module.exports = router;