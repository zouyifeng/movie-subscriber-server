import * as express from 'express'
import * as jsSHA from 'jssha'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Config } from './Config'
import * as xml2js from 'xml2js'
import { User } from './entities/user';
import * as cheerio from 'cheerio'
import { UserService } from './services/user';
import { MovieService } from './services/movie';
import { Movie } from './entities/movie';

class App {
  public express

  constructor() {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes(): void {
    const router = express.Router()
    router.all('/', (req, res) => {
      console.log(req.method)
      if (req.method === 'GET') {
        const token = 'zouyifeng'
        const signature = req.query.signature  // 微信加密签名
        const timestamp = req.query.timestamp  // 时间戳
        const nonce = req.query.nonce          // 随机数
        const echostr = req.query.echostr      // 随机字符串
        
        // 将token、timestamp、nonce三个参数进行字典序排序
        const array = [token, timestamp, nonce]
        array.sort()

        // 将三个参数字符串拼接成一个字符串进行sha1加密
        var tempStr = array.join('')
        var shaObj = new jsSHA('SHA-1', 'TEXT')
        shaObj.update(tempStr)
        var scyptoString = shaObj.getHash('HEX')

        // 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (signature === scyptoString) {
          console.log('验证成功')
          res.send(echostr)
        } else {
          console.log('验证失败')
          res.send('验证失败')
        }
      } else {
        const parser = new xml2js.Parser()
        const builder = new xml2js.Builder()
        let reqData = ''
        req.on('data', function (chunk) {
          reqData += chunk
        })
        req.on('end', function () {
          parser.parseString(reqData.toString(), function (err, result) {
            if (result && result.xml) {
            var body = result.xml
            if (body.MsgType[0] === 'event') {
              if (body.Event[0] === 'subscribe') {
                // console.log(body.FromUserName[0])
                let user: User = new User();
                user.open_id = body.FromUserName[0]
                UserService.newUser(user)
  
                var xmlContent = `<xml><ToUserName><![CDATA[${body.FromUserName[0]}]]></ToUserName>
                                  <FromUserName><![CDATA[${body.ToUserName[0]}]]></FromUserName>
                                  <CreateTime>" + new Date().getTime() + "</CreateTime>
                                  <MsgType><![CDATA[text]]></MsgType>
                                  <Content><![CDATA[嘻嘻嘻，欢迎光临]]></Content></xml>`
                res.send(xmlContent)
              }
            } else if (body.MsgType[0] === 'text') {
              const content = body.Content[0]
              console.log(content)
              const name = ``
              MovieService.findLastestMovie().then((result: any) => {
                console.log(result[0])
                const name = `名字： ${result[0].title}
简介：${result[0].intro}`
                              var xmlContent = `<xml><ToUserName><![CDATA[${body.FromUserName[0]}]]></ToUserName>
                                  <FromUserName><![CDATA[${body.ToUserName[0]}]]></FromUserName>
                                  <CreateTime>" + new Date().getTime() + "</CreateTime>
                                  <MsgType><![CDATA[text]]></MsgType>
                                  <Content><![CDATA[${name}]]></Content></xml>`
                res.send(xmlContent);
              })
            }
          }
          })
        })
      }
    })
    this.express.use('/', router)
  }
}

function getAccessToken() {
  const appId: string = Config.APP_ID;
  const appSecret: string = Config.APP_SECRET;
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  axios.get(url).then(res => console.log(res))
}


function typeing() {
  // const appId: string = Config.APP_ID;
  const appSecret: string = Config.APP_SECRET; //?
  const url = `https://api.weixin.qq.com/cgi-bin/messa?ge/custom/typing?access_token=16_qhETXMTfgnQIYVbyLWRZb1jT3CWwiZEDfHMeUsI0uIXgsg2tG7fPiVqvnBDpyk7XsXAbyuXvKQM22OenWOrC0wiwOEC-aPVAKL6KTFa8OzJC9MlFYbJASPKplG39LlUZchsd31Wu0L6x-hd1KPHhAFAXCU`
  axios.post(url, {
    touser: 'o0Wzp5gALtFs9xFe-dPAKxxk2-iM',
    command: 'Typing'
  }).then(res => console.log(res.data))
}

// getAccessToken()
// typeing()

export default new App().express