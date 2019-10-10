const Sequelize = require('sequelize');

class RefrigeratorIngredient extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({
			count: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}, { tableName: 'refrigerator-ingredients', sequelize })
	}
}

module.exports = RefrigeratorIngredient;
