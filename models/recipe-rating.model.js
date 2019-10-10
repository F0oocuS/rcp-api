const Sequelize = require('sequelize');

class RecipeRating extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({
			value: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}, { tableName: 'recipe-ratings', sequelize })
	}

	static async getRecipeRating(recipeId) {
		const rating = await RecipeRating.findAll({
			attributes: ['recipeId', [RecipeRating.sequelize.fn('AVG', RecipeRating.sequelize.col('value')), 'value']],
			group: ['recipeId'],
			where: {
				recipeId
			}
		});

		return rating[0] ? parseInt(rating[0].value).toFixed(1) : null;
	}

	static async getTopRatedRecipes(limit) {
		return await RecipeRating.findAll({
			attributes: ['recipeId', [RecipeRating.sequelize.fn('AVG', RecipeRating.sequelize.col('value')), 'value']],
			group: ['recipeId'],
			order: [[RecipeRating.sequelize.fn('AVG', RecipeRating.sequelize.col('value')), 'DESC']],
			limit: limit
		});
	}
}

module.exports = RecipeRating;
