const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { v4 } = require('uuid');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("in multer",file)
        if(file.fieldname==='photo'){
            const userEmail = req.user.email.toLowerCase()
            var dir = `./public/uploads/${userEmail}/${file.fieldname}`
        }
        if (!fs.existsSync(dir)) {
            //console.log("making files")
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) console.error('New Directory Creation Error');
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null,`File-${v4()}-${file.originalname}` )
    },
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 6000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        console.log("invalid file")
        // req.flash("error_msg", "Enter a valid picture of format jpeg jpg png") 
        return cb(null,false)
    }
}


//uploading finishes
const universityController = require('../controllers/universityControllers')
const { requireAuth, redirectIfLoggedIn } = require('../middleware/universityAuth')
router.get('/dashboard', universityController.dashboard_get)
router.get('/verify/:id', universityController.emailVerify_get)
router.get('/signup',redirectIfLoggedIn, universityController.signup_get)
router.post('/signup', universityController.signup_post)
router.get('/login', redirectIfLoggedIn, universityController.login_get)
router.post('/login', universityController.login_post)
router.get('/logout', requireAuth, universityController.logout_get)
router.get('/profile', requireAuth, universityController.profile_get)

router.post('/createPost',requireAuth,upload.single('photo'), universityController.createPost)



router.get('/forgotPassword', redirectIfLoggedIn,universityController.getForgotPasswordForm)
router.post('/forgotPassword', redirectIfLoggedIn,universityController.forgotPassword)
router.get('/resetPassword/:id/:token',universityController.getPasswordResetForm)
router.post('/resetPassword/:id/:token',universityController.resetPassword)




module.exports = router