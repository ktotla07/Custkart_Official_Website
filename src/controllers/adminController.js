const User = require('../models/User')
const Document = require('../models/Document')
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config()



module.exports.dashboard_get = (req, res) => {
    res.render('./admin/dashboard', {
        type: 'dashboard',
    })
}
