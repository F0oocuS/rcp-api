const Refrigerator = require('../models/refrigerator.model');

exports.getAllRefrigeratorIngredients = (req, res, next) => {
	Refrigerator.getAllRefrigeratorIngredients(req.userId)
		.then(ingredients => ingredients ? res.json(ingredients) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.addIngredientToRefrigerator = (req, res, next) => {
	Refrigerator.addIngredientToRefrigerator(req.userId, req.body)
		.then(ingredient => ingredient ? res.json(ingredient) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.changeIngredientCount = (req, res, next) => {
	Refrigerator.changeIngredientCount(req.userId, req.body)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.removeIngredientFromRefrigerator = (req, res, next) => {
	Refrigerator.removeIngredientFromRefrigerator(req.userId, parseInt(req.param('id')))
		.then(ingredient => ingredient ? res.json(ingredient) : res.sendStatus(400))
		.catch(error => next(error));
};

