import * as express from 'express'
import axios, { AxiosResponse } from 'axios'
import { WechatService } from './services/wechat'
import { Config } from './config'
const log4js = require('./log')
const logger = require('./log').logger('App.ts', 'warn')

class App {
  public express

  constructor() {
    this.express = express()
    this.mountRoutes()
    log4js.use(this.express)
  }

  private mountRoutes(): void {
    const router = express.Router()

    router.all('/', (req, res) => {
      if (req.method === 'GET') {
        const {signature, timestamp, nonce, echostr} = req.query  // 微信加密签名

        // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (WechatService.authorize(signature, timestamp, nonce)) {
          logger.info('微信auth验证成功')
          res.send(echostr)
        } else {
          logger.error('微信auth验证失败')
          res.send('验证失败')
        }
      } else {
        let reqData = ''
        req.on('data', function (chunk) {
          reqData += chunk
        })
        req.on('end', function () {
          WechatService.dealWechatMessage(reqData.toString(), res);
        })
      }
    })
    this.express.use('/', router)
  }
}

export default new App().express