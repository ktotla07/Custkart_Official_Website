const express = require('express')
const router = express.Router()
const { contactMail } = require('../config/nodemailer');
//Route for homepage
router.get('/', async(req, res) => {
    const isLoggedIn=req.cookies.jwt
    // var user=null
    // if(isLoggedIn){
    //     user==await req.user.populate('bag').execPopulate()
    // }
    res.render('./userViews/index',{
        isLoggedIn
    })
});

module.exports = router
