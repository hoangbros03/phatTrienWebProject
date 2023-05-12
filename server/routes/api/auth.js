const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const centerController= require('../../controllers/centerController');
const authController=require('../../controllers/authController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

//TODO: Add verify roles add other API, currently just for testing purpose.
router.route('/login')
    .post(authController.handleLogin);

module.exports=router