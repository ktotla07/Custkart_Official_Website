const mongoose = require('mongoose')


const documentSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    desc:{
        type: String,
        trim: true,
    },
    url:{
        type: String,
        trim: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'User'
    }
})



const Document = mongoose.model('Document', documentSchema)

module.exports = Document
