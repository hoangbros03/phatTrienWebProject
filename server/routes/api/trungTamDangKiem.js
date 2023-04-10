const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


//TODO: Add verify roles add other API, currently just for testing purpose.
router.route('/:user/')
    .get(carsController.searchCar)
    .post(carsController.createCar);

router.route('/:user/carList')
    .get(carsController.getCarsList);

router.route('/:user/carSpec')
    .get(carsController.getCarsList)
    .post(carsController.createCarSpecification);

module.exports = router;