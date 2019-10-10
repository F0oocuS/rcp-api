const Sequelize = require('sequelize');

class ShoppingListRecipe extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({}, { tableName: 'shopping-list-recipes', sequelize });
	}
}

module.exports = ShoppingListRecipe;
