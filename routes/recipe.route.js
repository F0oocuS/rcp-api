const express = require('express');

const recipeController = require('../controllers/recipe.controller');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('', isAuth, recipeController.createNewRecipe);

router.get('', recipeController.getAllRecipes);

router.get('/user', isAuth, recipeController.getAllUserRecipes);

router.get('/favorite', isAuth, recipeController.getUserFavoriteRecipes);

router.get('/top-rate', recipeController.getTopRatedRecipes);

router.post('/favorite', isAuth, recipeController.addRemoveRecipeToFavorite);

router.post('/rating', isAuth, recipeController.addRecipeRating);

router.post('/comment', isAuth, recipeController.addCommentToRecipe);

router.post('/search', recipeController.findRecipesByName);

router.get('/:id', recipeController.getSingleRecipe);

module.exports = router;
