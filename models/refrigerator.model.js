const Sequelize = require('sequelize');

const Ingredient = require('./ingredient.model');
const RefrigeratorIngredient = require('./refrigerator-ingredient.model');

class Refrigerator extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({}, { tableName: 'refrigerators', sequelize });
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'userId' });
		this.belongsToMany(models.Ingredient, { through: models.RefrigeratorIngredient, foreignKey: 'refrigeratorId' });
	}

	static async getAllRefrigeratorIngredients(userId) {
		const data = [];
		const refrigerator = await Refrigerator.findOne({ where: { userId } });

		const ingredients = await refrigerator.getIngredients();

		for (let i = 0; i < ingredients.length; i++) {
			data.push({
				id: ingredients[i].id,
				name: ingredients[i].name,
				count: ingredients[i].RefrigeratorIngredient.count
			});
		}

		return data;
	}

	static async addIngredientToRefrigerator(userId, data) {
		const { ingredientId, count } = data;

		const refrigerator = await Refrigerator.findOne({ where: { userId } });

		const ingredient = await Ingredient.getIngredientById(ingredientId);

		await refrigerator.addIngredient(ingredient, { through: { count } });

		return { id: ingredient.id, name: ingredient.name, count };
	}

	static async changeIngredientCount(userId, data) {
		const { ingredientId, count } = data;

		const refrigerator = await Refrigerator.findOne({ where: { userId }});

		await RefrigeratorIngredient.update({ count }, { where: { refrigeratorId: refrigerator.id, ingredientId }});

		return { id: ingredientId, count }
	}

	static async removeIngredientFromRefrigerator(userId, ingredientId) {
		const refrigerator = await Refrigerator.findOne({ where: { userId } });

		const ingredient = await Ingredient.getIngredientById(ingredientId);

		await refrigerator.removeIngredient(ingredient);

		return { id: ingredientId, name: ingredient.name } ;
	}
}

module.exports = Refrigerator;
