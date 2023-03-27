const { timeStamp } = require('console');
const {createLogger, format, transports, config} = require('winston');

// 0: error 
// 1: warn
// 2: info
// 3: verbose
// 4: debug
// 5: silly
//example logger
const runLogger = createLogger({
    levels: config.syslog.levels,
    defaultMeta: { component: 'user-service' },
    format: format.combine(
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        format.json()
      ),
   
    transports: [
        new transports.Console(),
        new transports.File({filename: 'combinedNormal.log', level: 'info'})
    ],
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({filename: 'combinedError.log', level: 'error'})
    ]
})
//Create other logger below
module.exports=runLogger