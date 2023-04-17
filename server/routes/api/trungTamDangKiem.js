const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const centerController= require('../../controllers/centerController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const {'model': carSpecification, schema: carSpecSchema}= require('../../models/CarSpecification');
const humanRelevantController = require('../../controllers/humanRelevantController');

//TODO: Add verify roles add other API, currently just for testing purpose.
router.route('/:user/')
    .get(carsController.searchCar)
    .post(carsController.createCar);

router.route('/:user/carList')
    .get(carsController.getCarsList);

router.route('/:user/carSpec')
    .get(carsController.getCarsList)
    .post(carsController.createCarSpecification)
    .patch(async (req,res)=>{
        await carSpecification.updateMany({type: "Truck"}, {type:"xe tải"}).then((e)=>{console.log("Chos hungf")});
        // specs.forEach(e=>{
        //     if(e.type=="Car"){
        //         e.type="xe con"
        //     }else if(e.type=="Truck"){
        //         e.type="xe tải";
        //     }
        // });
        // await specs.save().then((e)=>{console.log("success")});
    });

router.route('/:user/newRegistry')
    .post(centerController.addRegistry);

//TODO: Handle when :licensePlate have character "."
router.route('/:user/car/:licensePlate/update')
    .patch(humanRelevantController.updateInformation);

module.exports = router;