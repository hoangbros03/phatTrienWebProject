const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


//TODO: Add verify roles add other API, currently just for testing purpose.
router.route('/')
    .get(carsController.searchCar)
    .post(carsController.createCar);

router.route('/carList')
    .get(carsController.getCarsList);

module.exports = router;