const logger = require('../logger/logger');
const errorHandler = (err, req, res ,next)=>{
    logger.error(`${err.name}: ${err.message}`);
    res.status(500).send(err.message);


}

module.exports = errorHandler;