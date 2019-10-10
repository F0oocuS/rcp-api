const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const User = require('./user.model');
const Ingredient = require('./ingredient.model');
const RecipeRating = require('./recipe-rating.model');
const RecipeComments = require('./recipe-comment.model');
const UserFavoriteRecipe = require('./user-favorite-recipe.model');

class Recipe extends Sequelize.Model {
	static init(sequelize, DataType) {
		return super.init({
			name: {
				type: DataType.STRING,
				allowNull: false
			},
			description: {
				type: DataType.TEXT,
				allowNull: false
			},
			process: {
				type: DataType.TEXT,
				allowNull: false
			},
			imagePath: {
				type: DataType.STRING,
				allowNull: true
			}
		}, { tableName: 'recipes', sequelize });
	}

	static associate(models) {
		this.hasMany(models.RecipeComment, { foreignKey: 'recipeId' });

		this.belongsTo(models.User, { foreignKey: 'userId' });

		this.belongsToMany(models.User, { through: models.RecipeRating, foreignKey: 'recipeId' });
		this.belongsToMany(models.User, { through: models.UserFavoriteRecipe, foreignKey: 'recipeId' });
		this.belongsToMany(models.Ingredient, { through: models.RecipeIngredient, foreignKey: 'recipeId' });
		this.belongsToMany(models.ShoppingList, { through: models.ShoppingListRecipe, foreignKey: 'recipeId' });
	}

	static async createNewRecipe(data, imagePath, userId) {
		const { name, description, process, ingredients } = data;
		const parsedIngredients = JSON.parse(ingredients);

		const user = await User.getUserById(userId);
		const recipe = await user.createRecipe({ name, description, process, imagePath });

		const recipeData = {};

		recipeData.id = recipe.id;
		recipeData.name = recipe.name;
		recipeData.process = recipe.process;
		recipeData.description = recipe.description;
		recipeData.imagePath = imagePath;
		recipeData.ingredients = [];
		recipeData.rating = null;

		for (let i = 0; i < parsedIngredients.length; i++) {
			const ingredient = await Ingredient.findByPk(parsedIngredients[i].id);

			await recipe.addIngredient(ingredient, { through: { count: parsedIngredients[i].count || 1 } });

			recipeData.ingredients.push({ id: ingredient.id, name: ingredient.name, count: parsedIngredients[i].count });
		}

		return recipeData;
	}

	static async getSingleRecipe(recipeId, userId) {
		const data = {};

		const recipe = await Recipe.findByPk(recipeId);

		data.id = recipe.id;
		data.name = recipe.name;
		data.description = recipe.description;
		data.process = recipe.process;
		data.imagePath = recipe.imagePath;

		data.ingredients = await Recipe.getRecipeIngredients(recipe);
		data.rating = await RecipeRating.getRecipeRating(recipeId);
		data.comments = await Recipe.getRecipeComments(recipeId);

		if (userId) {
			data.isFavorite = await Recipe.checkIsRecipeFavorite(recipeId, userId);
		}

		return data;
	}

	static async getAllRecipes(userId) {
		const data = [];

		const recipes = await Recipe.findAll();

		for (let i = 0; i < recipes.length; i++) {
			data.push({
				id: recipes[i].id,
				name: recipes[i].name,
				description: recipes[i].description,
				process: recipes[i].process,
				imagePath: recipes[i].imagePath,
				ingredients: await Recipe.getRecipeIngredients(recipes[i]),
				rating: await RecipeRating.getRecipeRating(recipes[i].id)
			});

			if (userId) {
				data[i].isFavorite = await Recipe.checkIsRecipeFavorite(recipes[i].id, userId);
			}
		}

		return data;
	}

	static async getAllUserRecipe(userId) {
		const data = [];
		const user = await User.getUserById(userId);

		const recipes = await user.getRecipes();

		for (let i = 0; i < recipes.length; i++) {
			data.push({
				id: recipes[i].id,
				name: recipes[i].name,
				description: recipes[i].description,
				process: recipes[i].process,
				imagePath: recipes[i].imagePath,
				ingredients: await Recipe.getRecipeIngredients(recipes[i]),
				rating: await RecipeRating.getRecipeRating(recipes[i].id),
				isFavorite: await Recipe.checkIsRecipeFavorite(recipes[i].id, userId)
			})
		}

		return data;
	}

	static async getUserFavoriteRecipe(userId) {
		const data = [];
		const user = await User.getUserById(userId);

		const recipes = await user.getFavoriteRecipe();

		for (let i = 0; i < recipes.length; i++) {
			data.push({
				id: recipes[i].id,
				name: recipes[i].name,
				description: recipes[i].description,
				process: recipes[i].process,
				imagePath: recipes[i].imagePath,
				ingredients: await Recipe.getRecipeIngredients(recipes[i]),
				rating: await RecipeRating.getRecipeRating(recipes[i].id),
				isFavorite: await Recipe.checkIsRecipeFavorite(recipes[i].id, userId)
			})
		}

		return data;
	}

	static async addRemoveRecipeToFavorite(recipeId, userId) {
		const recipe = await Recipe.findByPk(recipeId);
		const user = await User.getUserById(userId);

		const isFavorite = await UserFavoriteRecipe.findOne({ where: { userId, recipeId } });
		let message;

		if (isFavorite) {
			await user.removeFavoriteRecipe(recipe);
			message = 'Recipe was removed from favorite'
		} else {
			await user.addFavoriteRecipe(recipe);
			message = 'Recipe was add to favorite'
		}

		return { recipeId: recipe.id, message }
	}

	static async addRecipeRating(data, userId) {
		const { recipeId, mark } = data;

		const recipe = await Recipe.findByPk(recipeId);
		const user = await User.getUserById(userId);

		await user.addRating(recipe, { through: { value: mark } });

		const rating = await RecipeRating.getRecipeRating(recipe.id);

		return { rating, recipeId: recipe.id };
	}

	static async addCommentToRecipe(data, userId) {
		const { recipeId, comment } = data;

		const user = await User.getUserById(userId);
		const recipe = await Recipe.findByPk(recipeId);

		await RecipeComments.create({ userId: user.id, recipeId: recipe.id, comment });

		const returnedData = {
			userName: user.userName,
			comment
		};

		if (user.firstName && user.lastName) {
			returnedData.fullName = await User.getFullName(user);
		}

		return returnedData;
	}

	static async getRecipeComments(recipeId) {
		const comments = await RecipeComments.findAll({ where: { recipeId } });

		const data = [];

		for (let i = 0; i < comments.length; i++) {
			const user = await User.getUserById(comments[i].userId);

			data.push({
				userName: user.userName,
				comment: comments[i].comment
			});

			if (user.firstName && user.lastName) {
				data[i].fullName = await User.getFullName(user);
			}
		}

		return data;
	}

	static async getRecipeIngredients(recipe) {
		const ingredients = await recipe.getIngredients();
		const data = [];

		if (ingredients) {
			for (let i = 0; i < ingredients.length; i++) {
				data.push({
					id: ingredients[i].id,
					name: ingredients[i].name,
					count: ingredients[i].RecipeIngredient.count
				});
			}
		}

		return data;
	}

	static async checkIsRecipeFavorite(recipeId, userId) {
		const check = await UserFavoriteRecipe.findOne({ where: { recipeId, userId } });

		return await !!check
	}

	static async getTopRatedRecipes(userId, count) {
		const recipeRatings = await RecipeRating.getTopRatedRecipes(count);
		const recipeIds = [];

		for (let i = 0; i < recipeRatings.length; i++) {
			recipeIds.push(recipeRatings[i].recipeId);
		}

		const recipes = await Recipe.findAll({
			where: {
				id: {
					[Op.in]: recipeIds
				}
			}
		});

		const data = [];

		for (let i = 0; i < recipes.length; i++) {
			data.push({
				id: recipes[i].id,
				name: recipes[i].name,
				description: recipes[i].description,
				process: recipes[i].process,
				imagePath: recipes[i].imagePath,
				ingredients: await Recipe.getRecipeIngredients(recipes[i]),
				rating: await RecipeRating.getRecipeRating(recipes[i].id)
			});

			if (userId) {
				data[i].isFavorite = await Recipe.checkIsRecipeFavorite(recipes[i].id, userId);
			}
		}

		return data;
	}

	static async findRecipesByName(string, userId) {
		const recipes = await Recipe.findAll({ where: { name: { [Op.substring]: string } } });

		const data = [];

		for (let i = 0; i < recipes.length; i++) {
			data.push({
				id: recipes[i].id,
				name: recipes[i].name,
				description: recipes[i].description,
				process: recipes[i].process,
				imagePath: recipes[i].imagePath,
				ingredients: await Recipe.getRecipeIngredients(recipes[i]),
				rating: await RecipeRating.getRecipeRating(recipes[i].id)
			});

			if (userId) {
				data[i].isFavorite = await Recipe.checkIsRecipeFavorite(recipes[i].id, userId);
			}
		}

		return data;
	}
}

module.exports = Recipe;
