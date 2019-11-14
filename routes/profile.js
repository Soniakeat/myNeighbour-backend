const express = require('express');
const router = express.Router();
const createError = require("http-errors");
const User = require('../models/User');

//Helper functions
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin
} = require('../helpers/middlewares');

//GET One User
router.get('/:id', isLoggedIn(), async (req, res, next) => {
    const oneUserId = req.params.id
    const oneUser = await User.find()
    res.json(allUsers);
});