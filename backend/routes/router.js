const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const priceController = require('../controllers/priceController');

router.delete('/user/:id', userController.usun);
router.delete('/price/:id', priceController.usunPrice);
router.post('/user', userController.dodaj);
router.get('/userData', userController.data);
router.put('/user/:id/expiration', userController.updateExpiration); // New route for updating expiration
router.post('/addPrice', priceController.dodajCene);
router.get('/getPrice', priceController.dataPrice);
router.put('/price/update', priceController.updatePrice);

module.exports = router;
