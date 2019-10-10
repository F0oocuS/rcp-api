const User = require('../models/user.model');

const { body, validationResult } = require('express-validator/check');

exports.signUp = (req, res, next) => {
	const error = validationResult(req);

	if (error.length) {
		let err = [];

		for (let i = 0; i < error.length; i++) {
			err.push(error.msg);
		}

		throw err;
	}

	User.signUpUser(req.body)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.signIn = (req, res, next) => {
	const error = validationResult(req).array();

	if (error.length) {
		let err = [];

		for (let i = 0; i < error.length; i++) {
			err.push(error.msg);
		}

		throw err;
	}

	User.signInUser(req.body)
		.then(data => data ? res.json(data) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.getUser = (req, res, next) => {
	User.getUserById(req.userId)
		.then(user => user ? res.json(user) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.addMoreUserInfo = (req, res, next) => {
	User.addMoreUserInfo(req.body, req.userId)
		.then(user => user ? res.json(user) : res.sendStatus(400))
		.catch(error => next(error));
};

exports.validator = methods => {
	switch (methods) {
		case 'signUp': {
			return [
				body('email', 'Invalid email address').isEmail(),
				body('password', 'Invalid password').isLength({ min: 4 }),
				body('userName', 'Invalid email address').isLength({ min: 4 })
			]
		}
		case 'signIn': {
			return [
				body('email', 'Invalid email address').isEmail(),
				body('password', 'Invalid password').isLength({ min: 4 })
			]
		}
		default:
			return console.log('Wrong case value in router');
	}
};
