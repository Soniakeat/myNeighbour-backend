const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/User");
const Item = require("../models/Item");

//Helper functions
const { isLoggedIn } = require("../helpers/middlewares");

//GET One User
router.get("/:id", isLoggedIn(), async (req, res, next) => {
    try {
        const userId = req.params.id;
        const oneUser = await User.findById(userId);
        res.json(oneUser);
    } catch (error) {
        next(error);
    }
}); 

//GET Profile info of owner and his items
router.get("/:id/items", isLoggedIn(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await Item.find({
      owner: id
    }).populate("contacts");
    const user = await User.findById(id);
    user.items = items;
    res.json({
      user
    });
  } catch (error) {
    next(error);
  }
});

//PUT Edit personal profile
router.put("/edit/:id", isLoggedIn(), async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const {
    email,
    firstName,
    lastName,
    postalCode,
    phoneNumber,
    avatarURL
  } = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      email,
      firstName,
      lastName,
      postalCode,
      phoneNumber,
      image: avatarURL
    },
    {
      new: true
    }
  )
    .then(user => {
      req.session.currentUser = user;
      res.json(user);
    })
    .catch(error => {
      res.json(error);
    });
});

//DELETE Delete personal profile
router.delete("/delete/:id", isLoggedIn(), async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const sessionId = req.params.id;
  try {
    if (userId === sessionId) {
      await User.findByIdAndDelete(userId);
      res.json({ message: "your profile has been deleted" });
    } else {
      next(createError(403));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
