const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
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



const Product = mongoose.model('Product', productSchema)

module.exports = Product
