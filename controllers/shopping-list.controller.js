const ShoppingList = require('../models/shopping-list.model');

exports.addRecipeToShoppingList = (req, res, next) => {
	ShoppingList.addRecipeToShoppingList(req.userId, req.body.recipeId)
		.then(recipe => recipe ? res.json(recipe) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getAllShoppingListRecipes = (req, res, next) => {
	ShoppingList.getAllShoppingListRecipes(req.userId)
		.then(recipes => recipes ? res.json(recipes) : res.sendStatus(400))
		.catch(error => next(error));
};
