const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { v4 } = require('uuid');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.body)
        var dir = `./public/uploads/admin/${file.fieldname}`
       
        if (!fs.existsSync(dir)) {
            console.log("making files")
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
        cb(null,false)
    }
}



const adminController = require('../controllers/adminController')


const { requireAuth, redirectIfLoggedIn } = require('../middleware/adminAuth')
router.get('/dashboard',requireAuth, adminController.dashboard_get)
router.get('/handleInstitute',requireAuth, adminController.handleInstitute_get)
router.get('/login',redirectIfLoggedIn, adminController.login_get)
router.post('/login', adminController.login_post)
router.get('/aboutUniversity/:id',requireAuth, adminController.aboutUniversity_get)
router.get('/permitUser/:id/:userId',requireAuth, adminController.permitUser_get)
router.get('/handleInstitute', requireAuth,adminController.handleInstitute_get)
router.get('/addProduct',requireAuth, adminController.addProduct_get)

router.post('/createProduct',requireAuth,
upload.fields([{
    name: 'front', maxCount: 3
  }, {
    name: 'back', maxCount: 3
  }]),adminController.createPost)

module.exports = router