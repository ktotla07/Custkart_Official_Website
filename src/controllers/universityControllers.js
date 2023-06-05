const University = require('../models/University')
const DocUniversity = require('../models/DocUniversity')
const jwt = require('jsonwebtoken')
const { signupMailUni, passwordMailUni } = require('../config/nodemailer')
const path = require('path')
const { handleErrors } = require('../utilities/Utilities')
const crypto = require('crypto')
require('dotenv').config()
const { generateShortId } = require('../utilities/Utilities');

const maxAge = 30 * 24 * 60 * 60

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: "dxjcjsopt",
    api_key: "776272262761276",
    api_secret: "ZvhJVjaKl4CTKyDJIN-xKfNOit4"
  });

// controller actions
module.exports.signup_get = (req, res) => {
    res.render('./userViews/signupInstitute', {
        type: 'signup',
    })
}

module.exports.login_get = (req, res) => {
    res.render('./userViews/loginInstitute', {
        type: 'login',
    })
}

module.exports.dashboard_get = (req, res) => {
    res.render('./admin/dashboard', {
        type: 'dashboard',
    })
}


module.exports.signup_post = async (req, res) => {
    const { name, email, password, confirmPwd, phoneNumber } = req.body
    
    console.log('in sign up route', req.body)
    if (password != confirmPwd) {
        req.flash('error_msg', 'Passwords do not match. Try again')
        res.status(400).redirect('/university/login')
        return
    }

    try {
        const universityExists = await University.findOne({ email })
        console.log('universityexists', universityExists)
        /*if(universityExists && universityExists.active== false)
    {
      req.flash("success_msg",`${universityExists.name}, we have sent you a link to verify your account kindly check your mail`)

      signupMail(universityExists,req.hostname,req.protocol)
      return res.redirect("/signup")
    }*/
        if (universityExists) {
            req.flash(
                'success_msg',
                'This email is already registered. Try logging in'
            )
            return res.redirect('/university/login')
        }
        const short_id = generateShortId(name,phoneNumber);
        console.log('Short ID generated is: ', short_id)
        const university = new University({
            email,
            name,
            password,
            phoneNumber,
            short_id,
            
        })
        let saveUniversity = await university.save()
        console.log(saveUniversity);
        req.flash(
            'success_msg',
            'Registration successful. Check your inbox to verify your email'
        )
        signupMailUni(saveUniversity, req.hostname, req.protocol)
        //res.send(saveuniversity)
        res.redirect('/university/login')
    } catch (err) {
        const errors = handleErrors(err)
        console.log(errors)

        var message = 'Could not signup. '.concat(
            errors['email'] || '',
            errors['password'] || '',
            errors['phoneNumber'] || '',
            errors['name'] || ''
        )
        //res.json(errors);
        req.flash('error_msg', message)
        res.status(400).redirect('/university/signup')
    }
}
module.exports.emailVerify_get = async (req, res) => {
    try {
        const universityID = req.params.id
        const expiredTokenuniversity = await University.findOne({ _id: universityID })
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                signupMailUni(expiredTokenuniversity, req.hostname, req.protocol)
                return res.redirect('/university/login')
            }
            const university = await University.findOne({ _id: decoded.id })
            if (!university) {
                //console.log('university not found')
                res.redirect('/')
            } else {
                const activeuniversity = await University.findByIdAndUpdate(university._id, {
                    active: true,
                })
                if (!activeuniversity) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/')
                } else {
                    req.flash(
                        'success_msg',
                        'university has been verified and can login now'
                    )
                    //console.log('The university has been verified.')
                    //console.log('active', activeuniversity)
                    res.redirect('/university/login')
                }
            }
        })
    } catch (e) {
        console.log(e)
        //signupMail(university,req.hostname,req.protocol)
        res.redirect('/university/login')
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body
    // console.log('in Login route')
    // console.log('req.body',req.body)
    try {
        const university = await University.login(email, password)
        //console.log("university",university)

        const universityExists = await University.findOne({ email })
        console.log("universityexsits",universityExists)

        if (!universityExists.active) {
            const currDate = new Date()
            const initialUpdatedAt = universityExists.updatedAt
            const timeDiff = Math.abs(
                currDate.getTime() - initialUpdatedAt.getTime()
            )
            if (timeDiff <= 10800000) {
                // console.log('Email already sent check it')
                req.flash(
                    'error_msg',
                    `${universityExists.name}, we have already sent you a verify link please check your email`
                )
                res.redirect('/university/login')
                return
            }
            req.flash(
                'success_msg',
                `${universityExists.name}, your verify link has expired we have sent you another email please check you mailbox`
            )
            signupMailUni(universityExists, req.hostname, req.protocol)
            await University.findByIdAndUpdate(universityExists._id, {
                updatedAt: new Date(),
            })
            //console.log('universityExists',universityExists)
            res.redirect('/university/login')
            return
        }

        const token = university.generateAuthToken(maxAge)

        res.cookie('university', token, { httpOnly: true, maxAge: maxAge * 1000 })
        //console.log(university);
        //signupMail(saveuniversity)
        // console.log("logged in")
        res.status(200).send("success")
    } catch (err) {
        req.flash('error_msg', 'Invalid Credentials')
        //console.log(err)
        res.send(err)
    }
}





module.exports.profile_get = async (req, res) => {
    
    res.json(req.university)
    // console.log('in profile page')
}
module.exports.createPost = async (req, res) => {
    const {name,desc}=req.body
    const picture =req.file.path
    const result=await cloudinary.uploader.upload(picture, {public_id: "uploaded"})
    // console.log(result.secure_url)
    
      const url = cloudinary.url("uploaded", {
        width: 1500,
        height: 1000,
        Crop: 'fill'
      });
      console.log(url)
      const document = new DocUniversity({ name, desc,url,university:req.university._id})
      let saveDocument = await document.save()
      const universityDoc=req.university.document
      universityDoc.push(document._id)
      await DocUniversity.findOneAndUpdate({_id: req.university._id}, {$set:{document:universityDoc}}, {new: true}, (err, doc) => {
        if (err) {
            // console.log("Something wrong when updating data!");
            req.flash("error_msg", "Something wrong when updating data!")
            res.redirect('/')
        }
    });
      
      console.log(saveDocument)
    res.render('./universityViews/index')
}

module.exports.logout_get = async (req, res) => {
    // res.cookie('jwt', '', { maxAge: 1 });
    // const cookie = req.cookies.jwt
    res.clearCookie('jwt')
    req.flash('success_msg', 'Successfully logged out')
    res.redirect('/university/login')
}

// module.exports.upload_get =async (req, res) => {
//   res.render("multer")
// }

module.exports.getForgotPasswordForm = async (req, res) => {
    res.render('./universityViews/forgotPassword')
}

module.exports.getPasswordResetForm = async (req, res) => {
    const universityID = req.params.id
    const university = await university.findOne({ _id: universityID })
    const resetToken = req.params.token
    res.render('./universityViews/resetPassword', {
        universityID,
        resetToken,
    })
}

module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email
    const university = await university.findOne({ email })
    if (!university) {
        req.flash('error_msg', 'No university found')
        return res.redirect('/university/login')
    }
    //console.log(university)
    const universityID = university._id

    const dt = new Date(university.passwordResetExpires).getTime()
    if (
        (university.passwordResetToken && dt > Date.now()) ||
        !university.passwordResetToken
    ) {
        const resetToken = university.createPasswordResetToken()
        // console.log(university.passwordResetExpires)
        // console.log(university.passwordResetToken)
        await university.save({ validateBeforeSave: false })
        try {
            passwordMailUni(university, resetToken, req.hostname, req.protocol)
            req.flash('success_msg', 'Email sent,please check email')
            res.redirect('/university/forgotPassword')
        } catch (err) {
            university.passwordResetToken = undefined
            university.passwordResetExpires = undefined
            await university.save({ validateBeforeSave: false })
            req.flash('error_msg', 'Unable to send mail')
            res.redirect('/university/forgotPassword')
        }
    } else {
        req.flash(
            'error_msg',
            'Mail already send,please wait for sometime to send again'
        )
        res.redirect('/university/forgotPassword')
    }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const token = req.params.token
        const id = req.params.id
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')
        const university = await university.findOne({
            _id: req.params.id,
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        })
        if (!university) {
            req.flash('error_msg', 'No university found')
            return res.redirect('/university/login')
        }
        if (req.body.password !== req.body.cpassword) {
            req.flash('error_msg', 'Passwords dont match')
            return res.redirect(`resetPassword/${id}/${token}`)
        } else {
            university.password = req.body.password
            university.passwordResetToken = undefined
            university.passwordResetExpires = undefined
            await university.save()
            const JWTtoken = await university.generateAuthToken(maxAge)
            // university = university.toJSON()
            res.cookie('jwt', JWTtoken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
            })
            res.redirect('/university/profile')
        }
    } catch (err) {
        res.send(err)
    }
}









