const express = require('express');

const recipeController = require('../controllers/shopping-list.controller');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/recipes', isAuth, recipeController.getAllShoppingListRecipes);

router.post('', isAuth, recipeController.addRecipeToShoppingList);

module.exports = router;


