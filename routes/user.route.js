const express = require('express');

const userController = require('../controllers/user.controller');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/signup', userController.validator('signUp'), userController.signUp);

router.post('/signin', userController.signIn);

router.post('/more', isAuth, userController.addMoreUserInfo);

router.get('', isAuth, userController.getUser);

module.exports = router;
