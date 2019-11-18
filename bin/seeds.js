const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');


mongoose.connect(`mongodb://localhost:27017/myneighbour-database`, { useNewUrlParser: true, useUnifiedTopology: true });
//para borrar las collectiones anteriores
User.collection.drop(); 
Item.collection.drop(); 


const User = [
    {
        email: "Alfombra",
        password: "",
        username: "",
        firstname: "",
        lastName: "",
        phoneNumber: "",
        postalCode: "",
        items: []
    }  
]

const Item = [
    {
        title: "Alfombra",
        image: "https://fitnessexpertawards.com/wp-content/uploads/2019/06/female-squat-form.jpg",
        description: "first stand with your feet either hip-or shoulder-width apart.",
        owner: [],
        contacts: []
    }  
]





User.create(Users)
    .then(User => {
        console.log(User);
    })
    .catch(err => {
        return err
    })


Item.create(Items)
    .then(Item => {
        console.log(Item);
    })
    .catch(err => {
        return err
    })