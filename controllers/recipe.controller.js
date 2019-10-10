const Recipe = require('../models/recipe.model');

const jwt = require('jsonwebtoken');

exports.createNewRecipe = (req, res, next) => {
	Recipe.createNewRecipe(req.body, req.file.path, req.userId)
		.then(recipe => recipe ? res.json(recipe) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getSingleRecipe = (req, res, next) => {
	const recipeId = req.param('id');
	const token = req.get('Authorization');

	let userId = null;

	if (token) {
		userId = jwt.verify(token, 'secret-key').id;
	}

	Recipe.getSingleRecipe(recipeId, userId)
		.then(recipe => recipe ? res.json(recipe) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getAllRecipes = (req, res, next) => {
	const token = req.get('Authorization');

	let userId = null;

	if (token) {
		userId = jwt.verify(token, 'secret-key').id;
	}

	Recipe.getAllRecipes(userId)
		.then(recipes => recipes ? res.json(recipes) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getAllUserRecipes = (req, res, next) => {
	Recipe.getAllUserRecipe(req.userId)
		.then(recipes => recipes ? res.json(recipes) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getUserFavoriteRecipes = (req, res, next) => {
	Recipe.getUserFavoriteRecipe(req.userId)
		.then(recipes => recipes ? res.json(recipes) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.addRemoveRecipeToFavorite = (req, res, next) => {
	Recipe.addRemoveRecipeToFavorite(req.body.recipeId, req.userId)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.addRecipeRating = (req, res, next) => {
	Recipe.addRecipeRating(req.body, req.userId)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.addCommentToRecipe = (req, res, next) => {
	Recipe.addCommentToRecipe(req.body, req.userId)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getTopRatedRecipes = (req, res, next) => {
	const token = req.get('Authorization');

	let userId = null;

	if (token) {
		userId = jwt.verify(token, 'secret-key').id;
	}

	Recipe.getTopRatedRecipes(userId, 8)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.findRecipesByName = (req, res, next) => {
	const token = req.get('Authorization');

	let userId = null;

	if (token) {
		userId = jwt.verify(token, 'secret-key').id;
	}

	Recipe.findRecipesByName(req.body.name, userId)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};
