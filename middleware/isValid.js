module.export = (req, res, next) => {
	req
		.getValidationResult()
		.then(result => {
			if (result) {
				throw result.array;
			} else {
				next();
			}
		})
		.catch(error => {
			console.log(error);

			res.json(error);
		});
};
