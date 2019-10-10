const Sequelize = require('sequelize');

class RecipeComment extends Sequelize.Model {
	static init(sequelize, DataType) {
		return super.init({
			comment: {
				type: DataType.TEXT,
				allowNull: false
			}
		}, { tableName: 'recipe-comments', sequelize })
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'userId' });
		this.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
	}
}

module.exports = RecipeComment;
