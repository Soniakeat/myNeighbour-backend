const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin
} = require('../helpers/middlewares');

//GET all items
router.get('/', isLoggedIn(), async (req, res, next) => {
    try {
        const allItems = await Item.find()
        res.json(allItems.reverse());
    } catch (error) {
        console.error(error)
    }
});

//GET One Item
router.get('/:id', isLoggedIn(), async (req, res, next) => {
    try {
        const itemId = req.params.id
        const oneItem = await Item.findById(itemId).populate("owner")
        res.json(oneItem);

    } catch (error) {
        console.error(error)
    }
});

//POST Add One Item
router.post('/add', isLoggedIn(), async (req, res, next) => {
    try {
        const {
            title,
            description
        } = req.body
        const ownerId = req.session.currentUser._id
        const newItem = await Item.create({
            title,
            description,
            owner: ownerId
        })
        res.json(newItem);
    } catch (error) {
        console.error(error)
    }
});

//POST Add One Item
router.put('/edit/:id', isLoggedIn(), async (req, res, next) => {
    try {
        const itemId = req.params.id
        const {
            title,
            description,
            image
        } = req.body
        const ownerId = req.session.currentUser._id
        const item = await Item.findById(itemId)
        if (item.owner.equals(ownerId)) {
            const newItem = await Item.findByIdAndUpdate(itemId, {
                title,
                description,
                image
            }, {
                new: true
            })
            res.json(newItem);
        } else {
            res.json("You cant update this item");
        }

    } catch (error) {
        console.error(error)
    }
});

//DELETE Delete One Item
router.delete('/:id', isLoggedIn(), async (req, res, next) => {
    try {
        const ownerId = req.session.currentUser._id
        const itemId = req.params.id
        const item = await Item.findById(itemId)
        if (item.owner.equals(ownerId)) {
            const deletedItem = await Item.findByIdAndDelete(itemId)
            res.json(deletedItem);
        } else {
            res.json("You cant delete this item");
        }
    } catch (error) {
        console.error(error)
    }
});


module.exports = router;