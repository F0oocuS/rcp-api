const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class User extends Sequelize.Model {
	static init(sequelize, DataTypes) {
		return super.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			userName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: true
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: true
			},
			birthday: {
				type: DataTypes.DATE,
				allowNull: true
			}
		}, { tableName: 'users', sequelize });
	}

	static associate(models) {
		this.hasOne(models.ShoppingList, { as: 'shoppingList', foreignKey: 'userId' });
		this.hasOne(models.Refrigerator, { as: 'refrigerator', foreignKey: 'userId' });

		this.hasMany(models.Recipe, { foreignKey: 'userId' });
		this.hasMany(models.RecipeComment, { foreignKey: 'userId' });

		this.belongsToMany(models.Recipe, { through: models.RecipeRating, as: 'rating', foreignKey: 'userId' });
		this.belongsToMany(models.Recipe, { through: models.UserFavoriteRecipe, as: 'favoriteRecipe', foreignKey: 'userId' });
	}

	static async getUserById(userId) {
		return await User.findByPk(userId);
	}

	static async getFullName(user) {
		return user.firstName + ' ' + user.lastName
	}

	static async signUpUser(param) {
		const { email, userName, password } = param;
		const data = {};

		const hashedPassword = bcrypt.hashSync(password, 11);

		if (await User.findOne({ where: { email } })) {
			throw 'Email ' + param.email + ' is already exist';
		}

		if (await User.findOne({ where: { userName } })) {
			throw 'Username ' + param.userName + ' is already exist';
		}

		const user = await User.create({ email, userName, password: hashedPassword });

		data.user = { id: user.id, email: user.email, userName: user.userName };

		await user.createRefrigerator();
		await user.createShoppingList();

		data.token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '3w' });

		return data;
	}

	static async signInUser(param) {
		const { email, password } = param;
		const data = {};

		let user = await User.findOne({ where: { email } });

		if (!user) {
			throw 'User with this email ' + email + ' was not found!';
		}

		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			throw 'Wrong password!';
		}

		data.token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '3w' });
		data.user = { id: user.id, email: user.email, userName: user.userName };

		return data;
	}

	static async addMoreUserInfo(data, userId) {
		const { firstName, lastName, birthday } = data;

		await User.update({
			firstName,
			lastName,
			birthday
		}, {
			where: { id: userId }
		});

		return { firstName, lastName, birthday };
	}
}

module.exports = User;
