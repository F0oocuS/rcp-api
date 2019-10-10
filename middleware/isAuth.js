const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.get('Authorization');

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, 'secret-key');
	} catch (e) {
		error.statusCode = 500;

		console.log(error);

		throw error;
	}

	if (!decodedToken) {
		const error = new Error('Not authenticate');

		error.statusCode = 401;

		throw error;
	}

	req.userId = decodedToken.id;

	next();
};
