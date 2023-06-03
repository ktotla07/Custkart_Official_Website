const mongoose = require('mongoose')


const docUniversitySchema = mongoose.Schema({
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
        ref:'University'
    }
})



const DocUniversity = mongoose.model('DocUniversity', docUniversitySchema)

module.exports = DocUniversity
