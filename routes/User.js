const express = require('express');
const { getUsers, getMe } = require('../controllers/User');
const verifyToken = require('../middleware/Verify');

const userRouter = express.Router();

userRouter.get('/users', verifyToken, getUsers);
userRouter.get('/user', verifyToken, getMe);

module.exports = userRouter;
