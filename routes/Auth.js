const refreshToken = require('../controllers/RefreshToken');
const { registerUser, loginUser } = require('./../controllers/Auth');
const express = require('express');

const Authrouter = express.Router();

Authrouter.post('/register', registerUser);
Authrouter.post('/login', loginUser);
Authrouter.get('/access-token', refreshToken);

module.exports = Authrouter;
