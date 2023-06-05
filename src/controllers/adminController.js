const User = require('../models/User')
const Document = require('../models/Document')
const University = require('../models/University')
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config()



module.exports.dashboard_get = async(req, res) => {
    res.render('./admin/dashboard')
}
module.exports.handleInstitute_get = async(req, res) => {
    const universities=await University.find({})
    res.render('./admin/handleInstitute',{
        universities
    })
}
