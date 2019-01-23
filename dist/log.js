const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
const LEVEL = {
    'TRACE': log4js.levels.TRACE,
    'DEBUG': log4js.levels.DEBUG,
    'INFO': log4js.levels.INFO,
    'WARN': log4js.levels.WARN,
    'ERROR': log4js.levels.ERROR,
    'FATAL': log4js.levels.FATAL,
};
log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'dateFile',
            filename: path.join(__dirname, '../logs/'),
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    ],
    replaceConsole: true
});
exports.logger = function (name, level) {
    const logger = log4js.getLogger(name);
    logger.setLevel(LEVEL[level] || LEVEL.DEBUG);
    return logger;
};
exports.use = function (app, level) {
    app.use(log4js.connectLogger(log4js.getLogger('logInfo'), {
        level: LEVEL[level] || LEVEL.DEBUG,
        format: ':method :url :status'
    }));
};
//# sourceMappingURL=log.js.map