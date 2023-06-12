const mongoose = require('mongoose')


const bagSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    size:{
        type: String,
        trim: true,
    },
    price:{
        type: String,
        trim: true,
    },
    quantity:{
        type: String,
        trim: true,
    },
    productAdmin:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'Products'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'User'
    }
})



const Bag = mongoose.model('Bag', bagSchema)

module.exports = Bag
