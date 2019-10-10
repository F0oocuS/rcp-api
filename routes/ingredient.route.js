const express = require('express');

const ingredientController = require('../controllers/ingredient.controller');

const router = express.Router();

// router.get('', ingredientController.setIngredientToDatabase);

router.post('', ingredientController.findIngredientsByName);

router.get('', ingredientController.getAllIngredients);

router.get('/categories', ingredientController.getAllIngredientCategories);

router.get('/usage', ingredientController.getMoreUsageIngredients);

module.exports = router;
