const { format, transports, createLogger } = require('winston');


const logger  = createLogger({
    transports:[
        new transports.File({
            filename:'logs/info.log',
            maxsize: 5242880, // 5MB
            format: format.combine(
                format.timestamp({format: 'MM-DD-YYY HH:mm:ss'}),
                format.align(),
                format.printf(info=> `${info.level}: ${info.timestamp}: ${info.message}`)
            )}
        ),
        new transports.File({
            filename:'logs/all.log',
            maxsize: 5242880, // 5MB
            format: format.combine(
                format.timestamp({format: 'MM-DD-YYY HH:mm:ss'}),
                format.align(),
                format.printf(verbose=>`${verbose.level}: ${verbose.timestamp}: ${verbose.message}`)
            )}
        ),

    ]
})

module.exports = logger 