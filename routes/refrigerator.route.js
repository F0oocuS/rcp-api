const express = require('express');

const refrigeratorController = require('../controllers/refrigerator.controller');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('', isAuth, refrigeratorController.getAllRefrigeratorIngredients);

router.post('', isAuth, refrigeratorController.addIngredientToRefrigerator);

router.post('/update', isAuth, refrigeratorController.changeIngredientCount);

router.delete('/:id', isAuth, refrigeratorController.removeIngredientFromRefrigerator);

module.exports = router;
