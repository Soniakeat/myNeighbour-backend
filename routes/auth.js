const express = require('express');
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require('../models/User');


//Helper functions
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin
} = require('../helpers/middlewares');

//GET All Users
router.get('/users', async (req, res, next) => {
    const allUsers = await User.find()
    res.json(allUsers);
});

//GET '/me' 
router.get('/me', isLoggedIn(), (req, res, next) => {
    res.json(req.session.currentUser);
});

//POST '/login'
router.post('/login', isNotLoggedIn(), validationLoggin(), async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            next(createError(404));
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res
                .status(200)
                .json(user);
            return
        } else {
            next(createError(401));
        }
    } catch (error) {
        next(error);
    }
});

//POST '/signup'
router.post(
    "/signup", isNotLoggedIn(), validationLoggin(), async (req, res, next) => {
        const {
            email,
            password,
            firstName, lastName, phoneNumber, postalCode
        } = req.body;
        try {
            const emailExists = await User.findOne({
                email
            }, "email");
            if (emailExists) return next(createError(400));
            else {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashPass = bcrypt.hashSync(password, salt);
                const newUser = await User.create({
                    email,
                    password: hashPass,
                    firstName,
                    lastName,
                    phoneNumber,
                    postalCode
                });
                req.session.currentUser = newUser;

                res
                    .status(200) //  OK
                    .json(newUser);
            }
        } catch (error) {
            next(error);
        }
    }
);

//  POST    'auth/logout'
router.post('/logout', isLoggedIn(), (req, res, next) => {
    req.session.destroy();
    res
        .status(204)
        .send();
    return;
});



//  GET    '/private'   --> Only for testing - Same as /me but it returns a message instead
router.get('/private', isLoggedIn(), (req, res, next) => {
    res
        .status(200)
        .json({
            message: 'Test - User is logged in'
        });
});


module.exports = router;