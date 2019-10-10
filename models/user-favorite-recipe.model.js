const Sequelize = require('sequelize');

class UserFavoriteRecipe extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({}, { tableName: 'user-favorite-recipes', sequelize });
	}
}

module.exports = UserFavoriteRecipe;
