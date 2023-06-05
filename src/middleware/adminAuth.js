require('dotenv').config()

const requireAuth = (req, res, next) => {
    try{
    const token = req.cookies.admin
    //console.log(token);
    // check json web token exists & is verified
    if (!token) {
        res.redirect('/admin/login')
    }
}
catch(error){
    res.redirect("/user/login");
}
}


const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies.admin 
    if (token)
    {
        req.flash("error_msg", "You are already logged in.")
        res.redirect("/admin/dashboard")
    }
    
}

module.exports = { requireAuth, redirectIfLoggedIn }
