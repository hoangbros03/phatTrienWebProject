const express = require('express');
const router = express.Router();
const carsController = require('../../controllers/carsController');
const centerController= require('../../controllers/centerController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT);

router.route('/:user/center')
    .all(verifyJWT)
    .post(centerController.createNewCenter);

router.route('/:user/center/changePassword')
    .all(verifyJWT)
    .post(centerController.changePasswordCenter);
router.route('/:user/center/upload')
    .all(verifyJWT)
    .post(centerController.uploadCenters);
router.route('/secret/init/:key')
    .all(verifyJWT)
    .get(centerController.initAdmin);
//hung code 
router.route('/:user/center') 
    .all(verifyJWT)
    .get(centerController.getListCenter);
router.route('/:user/centers') 
    .all(verifyJWT)
    .get(centerController.getListCenters); 
router.route('/:user/center/changemodecenters') 
    .all(verifyJWT)
    .post(centerController.changeCenter);
module.exports = router;