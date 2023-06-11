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
const verifyJWT = require('../../middleware/verifyJWT')



// router.use(verifyJWT)



//BIG TODO: Change router also ON ALL CONTROLLERS
router.route('/:user/createCar')
    .all(verifyJWT)
    .post(carsController.createCar);
router.route('/:user/searchCar')
    .all(verifyJWT)
    .post(carsController.searchCar)
router.route('/:user/carList')
    .all(verifyJWT)
    .post(carsController.getCarsList);
router.route('/:user/deleteCar')
    .all(verifyJWT)
    .delete(carsController.deleteCar);
router.route('/:user/carSpec')
    .all(verifyJWT)
    .post(carsController.createCarSpecification);
router.route('/:user/databaseManagement/export')
    .all(verifyJWT)
    .post(carsController.exportCars);
router.route('/:user/databaseManagement/import')
    .all(verifyJWT)
    .post(carsController.uploadDB);
router.route('/:user/getCenters')
    .all(verifyJWT)
    .post(centerController.getCenters);
router.route('/:user/changeInformation')
    .all(verifyJWT)
    .patch(centerController.changePasswordCenter);
router.route('/:user/statistic(/:reCalc)?')
    .all(verifyJWT)
    .get(statisticController.statistic);
router.route('/:user/predict')
    .all(verifyJWT)
    .post(predictController.predict);
router.route('/:user/newRegistry')
    .all(verifyJWT)
    .post(centerController.addRegistry);

//TODO: Handle when :licensePlate have character "."
router.route('/:user/car/update')
    .all(verifyJWT)
    .patch(humanRelevantController.updateInformation);

//Get:Car specific;
router.route('/:user/getSpecificCar')
    .all(verifyJWT)
    .get(carsController.getSpecificCar);


module.exports = router;