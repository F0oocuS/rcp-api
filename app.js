const path = require('path');

const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const multer = require('multer');

const userRouter = require('./routes/user.route');
const recipeRouter = require('./routes/recipe.route');
const ingredientRouter = require('./routes/ingredient.route');
const refrigeratorRouter = require('./routes/refrigerator.route');
const shoppingListRouter = require('./routes/shopping-list.route');

const app = express();

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'images');
	},
	filename(req, file, cb) {
		cb(null, new Date().toISOString() + '_' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.json());
app.use(expressValidator());

app.use(multer({
	storage: storage,
	fileFilter: fileFilter,
	preservePath: false
}).single('image'));

app.use('/api/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});

app.use('/api', userRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/ingredient', ingredientRouter);
app.use('/api/refrigerator', refrigeratorRouter);
app.use('/api/shopping-list', shoppingListRouter);

app.use((error, req, res, next) => {
	console.log(error);

	const status = error.statusCode || 500;
	res.status(status).json(error);
});

sequelize.sequelize
	.sync()
	.then(() => {
		app.listen(3000);
	})
	.catch(error => console.log(error));
