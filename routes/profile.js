const express = require('express');
const router = express.Router();
const createError = require("http-errors");
const User = require('../models/User');
const Item = require('../models/Item');

//Helper functions
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin
} = require('../helpers/middlewares');

//GET Profile info of One User and his items
router.get('/:id', isLoggedIn(), async (req, res, next) => {
    try {
        const {
            id
        } = req.params
        const items = await Item.find({
            owner: id
        }).populate("contacts")
        const user = await User.findById(id)
        res.json({
            user,
            items
        })
    } catch (error) {
        console.error(error)
    }
});

//PUT Edit profile
router.put('/edit/:id', isLoggedIn(), async (req, res, next) => {
    const userId = req.session.currentUser._id
    const {
        email,
        password,
        userName,
        firstName,
        lastName,
        postalCode,
        phoneNumber
    } = req.body;
    User.findByIdAndUpdate(userId, {
            email,
            password,
            userName,
            firstName,
            lastName,
            postalCode,
            phoneNumber
        }, {
            new: true
        })
        .then((user) => {
            req.session.currentUser = user
            res.json(user);
        })
        .catch(error => {
            res.json(error);
        })
})


//DELETE Delete Profile
router.delete('/delete/:id', isLoggedIn(), async (req, res, next) => {
    try {



    } catch (error) {
        console.error(error)
    }
})


module.exports = router;