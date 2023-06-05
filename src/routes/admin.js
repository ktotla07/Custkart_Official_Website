const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { v4 } = require('uuid');


const adminController = require('../controllers/adminController')
router.get('/dashboard', adminController.dashboard_get)
router.get('/aboutUniversity', adminController.aboutUniversity_get)
router.get('/handleInstitute', adminController.handleInstitute_get)

module.exports = router