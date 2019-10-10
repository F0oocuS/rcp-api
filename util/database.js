const Sequelize = require('sequelize');
const sequelize = new Sequelize('app-rcp', 'root', 'rootroot', {
	host: 'localhost',
	dialect: 'mysql'
});

const UserModel = require('../models/user.model');
const UserFavoriteRecipeModel = require('../models/user-favorite-recipe.model');
const RecipeModel = require('../models/recipe.model');
const RecipeRatingModel = require('../models/recipe-rating.model');
const RecipeCommentModel = require('../models/recipe-comment.model');
const RecipeIngredientModel = require('../models/recipe-ingredient.model');
const IngredientMode = require('../models/ingredient.model');
const IngredientCategoriesModel = require('../models/ingredient-categories.module');
const ShoppingListModel = require('../models/shopping-list.model');
const ShoppingListRecipeModel = require('../models/shopping-list-recipe.model');
const ShoppingListIngredientModel = require('../models/shopping-list-ingredient.model');
const RefrigeratorModel = require('../models/refrigerator.model');
const RefrigeratorIngredientModel = require('../models/refrigerator-ingredient.model');


const models = {
	User: UserModel.init(sequelize, Sequelize),
	UserFavoriteRecipe: UserFavoriteRecipeModel.init(sequelize, Sequelize),
	Recipe: RecipeModel.init(sequelize, Sequelize),
	RecipeRating: RecipeRatingModel.init(sequelize, Sequelize),
	RecipeComment: RecipeCommentModel.init(sequelize, Sequelize),
	RecipeIngredient: RecipeIngredientModel.init(sequelize, Sequelize),
	Ingredient: IngredientMode.init(sequelize, Sequelize),
	IngredientCategory: IngredientCategoriesModel.init(sequelize, Sequelize),
	ShoppingList: ShoppingListModel.init(sequelize, Sequelize),
	ShoppingListRecipe: ShoppingListRecipeModel.init(sequelize, Sequelize),
	ShoppingListIngredient: ShoppingListIngredientModel.init(sequelize, Sequelize),
	Refrigerator: RefrigeratorModel.init(sequelize, Sequelize),
	RefrigeratorIngredient: RefrigeratorIngredientModel.init(sequelize, Sequelize)
};

Object.values(models)
	.filter(model => typeof model.associate === 'function')
	.forEach(model => model.associate(models));

const db = {
	...models,
	sequelize
};

module.exports = db;
