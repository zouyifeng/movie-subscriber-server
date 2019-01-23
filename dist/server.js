"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const wechat_1 = require("./services/wechat");
const movie_1 = require("./services/movie");
const log4js = require('./log');
const logger = require('./log').logger('App.ts', 'warn');
class App {
    constructor() {
        this.express = express();
        this.mountRoutes();
        log4js.use(this.express);
    }
    mountRoutes() {
        const router = express.Router();
        router.all('/', (req, res) => {
            if (req.method === 'GET') {
                const { signature, timestamp, nonce, echostr } = req.query; // 微信加密签名
                // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
                if (wechat_1.WechatService.authorize(signature, timestamp, nonce)) {
                    logger.info('微信auth验证成功');
                    res.send(echostr);
                }
                else {
                    logger.error('微信auth验证失败');
                    res.send('验证失败');
                }
            }
            else {
                let reqData = '';
                req.on('data', function (chunk) {
                    reqData += chunk;
                });
                req.on('end', function () {
                    wechat_1.WechatService.dealWechatMessage(reqData.toString(), res);
                });
            }
        });
        this.express.get('/lastest-movie', (req, res) => {
            movie_1.MovieService.findLastestMovies().then(movies => res.send(movies));
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=server.js.map