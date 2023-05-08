const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const centerController= require('../../controllers/centerController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const {'model': carSpecification, schema: carSpecSchema}= require('../../models/CarSpecification');
const humanRelevantController = require('../../controllers/humanRelevantController');
const statisticController = require('../../controllers/statisticController');
const predictController = require('../../controllers/predictController');

//TODO: Add verify roles add other API, currently just for testing purpose.

//BIG TODO: Change router also ON ALL CONTROLLERS
router.route('/:user/createCar')
    .post(carsController.createCar);
router.route('/:user/searchCar')
    .post(carsController.searchCar)
router.route('/:user/carList')
    .post(carsController.getCarsList);
router.route('/:user/deleteCar')
    .delete(carsController.deleteCar);
router.route('/:user/carSpec')
    .post(carsController.createCarSpecification);
router.route('/:user/databaseManagement/export')
    .post(carsController.exportCars);
router.route('/:user/databaseManagement/import')
    .post(carsController.uploadDB);
router.route('/:user/getCenters')
    .post(centerController.getCenters);
router.route('/:user/changeInformation')
    .patch(centerController.changePasswordCenter);
router.route('/:user/statistic(/:reCalc)?')
    .get(statisticController.statistic);
router.route('/:user/predict')
    .post(predictController.predict);
router.route('/:user/newRegistry')
    .post(centerController.addRegistry);

//TODO: Handle when :licensePlate have character "."
router.route('/:user/car/update')
    .patch(humanRelevantController.updateInformation);

module.exports = router;