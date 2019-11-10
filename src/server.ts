import * as express from 'express'
import axios, { AxiosResponse } from 'axios'
import { WechatService } from './services/wechat'
import { Config } from './config'
import { MovieService } from './services/movie';
import { UserService } from './services/user';
const log4js = require('./log')
const logger = require('./log').logger('App.ts', 'warn')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')


class App {
  public express

  constructor() {
    this.express = express()
    this.express.use(bodyParser.json())
    this.express.use(cookieParser())
    this.express.use(session({
      secret :  'secret', // 对session id 相关的cookie 进行签名
      resave : true,
      saveUninitialized: false, // 是否保存未初始化的会话
      cookie : {
          maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
      }
    }))
    log4js.use(this.express)
    this.mountRoutes()
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
    // 获取最新电影列表
    this.express.get('/lastest-movie', (req, res) => {
      MovieService.findLastestMovies().then(movies => {
        req.session.user = 'zouyifeng'
        res.send(movies)
      })
    })
    this.express.get('/session', (req, res) => {
      console.log(req.session);
      res.send(req.session)
      res.end()
    })
    // 获取电影详情
    this.express.get('/get-movie/:id', (req, res) => {
        console.log(req.params.id);
        req.session.user = 'zouyifeng' + req.params.id
        MovieService.findMovie(req.params.id).then(movie => {
          res.send(movie)
        })
      }
    )
    // 分页获取电影
    this.express.post('/get-movie-by-page', (req, res) => {
      // console.log('res: ', res);
      // console.log(req.params, req.body, req.query);
      console.log(req.params);
      console.dir(req.body)
      MovieService.getByMovieByPage(req.body.pageIndex, req.body.pageSize).then(list => {
        res.send(list)
      })
      // for (let i in req.body) {
      //   console.log(i);
      // }
    });

    this.express.post('/register', (req, res) => {
      if (req.body) {
         const { username, password } = req.body;
         UserService.register(username, password).then(result => {
           res.send({
             result: 1,
             msg: '注册成功'
           })
           res.end()
         })
      } else {
        res.send({ result: 0 })
      }
    })

    this.express.post('/login', async (req, res) => {
      if (req.body) {
        const { username, password } = req.body;
        const findResult = await UserService.findAdminUser(username, password)
        if (findResult.length === 0) {
          res.send({ result: 0, msg: '用户不存在或密码不正确' })
        } else {
          res.send({ result: 1, msg: '登录成功' })
          req.session.userId = findResult[0].id
          console.log('req.session.userId: ', req.session.userId);
        }
        // console.log('findResult: ', findResult);
      } else {

      }
    });

    this.express.use('/', router)
  }
}

export default new App().express