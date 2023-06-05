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
    if(name==process.env.name && password==process.env.password){

        res.cookie('admin', 'admin', { httpOnly: true, maxAge: maxAge * 1000 })
        res.redirect('/admin/dashboard')
    }
    res.redirect('/admin/login')
}
