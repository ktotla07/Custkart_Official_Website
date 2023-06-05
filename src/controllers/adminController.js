const User = require('../models/User')
const Document = require('../models/Document')
const University = require('../models/University')
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config()

const maxAge = 30 * 24 * 60 * 60


module.exports.dashboard_get = async(req, res) => {
    res.render('./admin/dashboard')
}
module.exports.handleInstitute_get = async(req, res) => {
    const universities=await University.find({})
    res.render('./admin/handleInstitute',{
        universities
    })
}
module.exports.login_get = async(req, res) => {
    
    res.render('./admin/login')
}
module.exports.login_post = async(req, res) => {
    const {name,password}=req.body
    console.log(res.body,process.env.name,process.env.password)
    if(name==process.env.name && password==process.env.password){

        res.cookie('admin', 'admin', { httpOnly: true, maxAge: maxAge * 1000 })
        res.redirect('/admin/dashboard')
    }else 
    res.redirect('/admin/login')
}
module.exports.aboutUniversity_get = async (req, res) => {
    const id=req.params.id
    const university = await University.findOne({ _id: id })
    const university1 = await university.populate('requestedUsers').execPopulate()
    const university2 = await university1.populate('permittedUsers').execPopulate()
    res.send(university2)
    // res.render('./admin/aboutUniversity', {
    //     university2
    // })
}
module.exports.permitUser_get = async (req, res) => {
    const id=req.params.id
    const userId=req.params.userId
    const university = await University.findOne({ _id: id })
    const requestedUsers=university.requestedUsers
    const permittedUsers=university.permittedUsers 
    if(requestedUsers.includes(userId)){
        requestedUsers.remove(userId)
        permittedUsers.push(userId)
        
        await University.findOneAndUpdate({_id: id}, {$set:{requestedUsers}}, {new: true}, (err, doc) => {
            if (err) {
                res.redirect('/')
            }
        });
        await University.findOneAndUpdate({_id: id}, {$set:{permittedUsers}}, {new: true}, (err, doc) => {
            if (err) {
                res.redirect('/')
            }
        });
    }
    res.send("success")
    // res.render('./admin/aboutUniversity', {
    //     university2
    // })
}