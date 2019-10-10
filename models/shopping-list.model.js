const Sequelize = require('sequelize');

const Recipe = require('./recipe.model');

class ShoppingList extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({}, { tableName: 'shopping-lists', sequelize });
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'userId' });

		this.belongsToMany(models.Recipe, { through: models.ShoppingListRecipe, foreignKey: 'shoppingListId' });
		this.belongsToMany(models.Ingredient, { through: models. ShoppingListIngredient, foreignKey: 'shoppingListId' });
	}

	static async getAllShoppingListRecipes(userId) {
		const shoppingList = await ShoppingList.findOne({ where: { userId } });

		const recipes = await shoppingList.getRecipes();

		const data = [];

		for (let i = 0; i < recipes.length; i++) {
			data.push({
				id: recipes[i].id,
				name: recipes[i].name,
				description: recipes[i].description,
				process: recipes[i].process,
				ingredients: await Recipe.getRecipeIngredients(recipes[i])
			})
		}

		return data;
	}

	static async addRecipeToShoppingList(userId, recipeId) {
		const shoppingList = await ShoppingList.findOne({ where: { userId } });
		const recipe = await Recipe.findByPk(recipeId);

		await shoppingList.addRecipe(recipe);

		return { id: recipe.id, name: recipe.name };
	}
}

module.exports = ShoppingList;
