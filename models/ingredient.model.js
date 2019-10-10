const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const RecipeIngredient = require('../models/recipe-ingredient.model');

class Ingredient extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			}
		}, { tableName: 'ingredients', sequelize });
	}

	static associate(models) {
		this.belongsTo(models.IngredientCategory, { foreignKey: 'ingredientCategoryId' });

		this.belongsToMany(models.Recipe, { through: models.RecipeIngredient, foreignKey: 'ingredientId' });
		this.belongsToMany(models.ShoppingList, { through: models.ShoppingListIngredient, foreignKey: 'ingredientId' });
		this.belongsToMany(models.Refrigerator, { through: models.RefrigeratorIngredient, foreignKey: 'ingredientId' });
	}

	static async getIngredientById(ingredientId) {
		return await Ingredient.findByPk(ingredientId);
	}

	static async findIngredientByName(substring) {
		return await Ingredient.findAll({ where: { name: { [Op.substring]: substring } } });
	}

	static async getMoreUsageIngredient() {
		return await RecipeIngredient.findAll({
			attributes: ['ingredientId', [RecipeIngredient.sequelize.fn('count', RecipeIngredient.sequelize.col('ingredientId')), 'ingredientCount']],
			group: ['ingredientId'],
			limit: 8
		});
	}
}

module.exports = Ingredient;
