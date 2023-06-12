const mongoose = require('mongoose')


const productsSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    desc:{
        type: String,
        trim: true,
    },
    price:{
        type: String,
        trim: true,
    },
    sizes:[{
        type: String,
        trim: true,
    }],
    availability:{
        type: String,
        trim: true,
    },
    front:[{
        type: String,
        trim: true,
    }],
    back:[{
        type: String,
        trim: true,
    }]
})



const Products= mongoose.model('Products', productsSchema)

module.exports = Products
