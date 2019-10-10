const Sequelize = require('sequelize');

class RecipeIngredient extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({
			count: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}, { tableName: 'recipe-ingredients', sequelize })
	}
}

module.exports = RecipeIngredient;
