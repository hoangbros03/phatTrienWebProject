const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const centerController= require('../../controllers/centerController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


//TODO: Add verify roles add other API, currently just for testing purpose.
router.route('/:user/center')
    .post(centerController.createNewCenter);

router.route('/:user/center/upload')
    .post(centerController.uploadCenters);

module.exports = router;