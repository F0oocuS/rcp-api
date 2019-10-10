const Sequelize = require('sequelize');

class IngredientCategories extends Sequelize.Model {
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
		}, { tableName: 'ingredient-categories', sequelize });
	}

	static associate(models) {
		this.hasMany(models.Ingredient, { foreignKey: 'ingredientCategoryId' });
	}
}

module.exports = IngredientCategories;
