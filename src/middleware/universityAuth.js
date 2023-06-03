const jwt = require('jsonwebtoken')
const University = require('../models/University')

require('dotenv').config()

const requireAuth = (req, res, next) => {
    try{
    const token = req.cookies.university
    //console.log(token);
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)

                res.redirect('/university/login')
            } else {
                let university = await University.findById(decodedToken.id)
                // if null then redirect to signup
                if (university == null)
                {
                    req.flash("error_msg", "You do not have an account yet, kindly sign up for one"); 
                    res.clearCookie('jwt')
                    res.redirect("/university/signup"); 
                    return; 
                }
                //else to profile
                req.university = university
                //console.log("current university", req.university)

                next()
            }
        })
    } else {
        res.redirect('/university/login')
    }
}
catch(error){
    res.redirect("/university/login");
}
}


const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies.university
    if (token)
    {
        req.flash("error_msg", "You are already logged in.")
        res.redirect("/university/profile")
    }
    else
    {
        next(); 
    }
}

module.exports = { requireAuth, redirectIfLoggedIn }
