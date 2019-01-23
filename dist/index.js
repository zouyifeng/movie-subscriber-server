"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const DBConnection_1 = require("./DBConnection");
const server_1 = require("./server");
const logger = require('./log').logger('index.ts', 'warn');
const port = 8089;
DBConnection_1.DBConnection.createConnection()
    .then(() => {
    logger.info('数据库连接成功');
    // schedule.scheduleJob('1 1 18 * * *', function() {
    //   fetchMovie()
    // })
})
    .catch(e => {
    logger.error('数据库连接错误');
    logger.error(e);
});
server_1.default.listen(port, err => {
    if (err) {
        return logger.error(err);
    }
    return logger.info(`server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map