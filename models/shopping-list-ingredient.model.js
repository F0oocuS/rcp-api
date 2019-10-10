const Sequelize = require('sequelize');

class ShoppingListIngredient extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({
			count: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		}, { tableName: 'shopping-list-ingredients', sequelize });
	}
}

module.exports = ShoppingListIngredient;
