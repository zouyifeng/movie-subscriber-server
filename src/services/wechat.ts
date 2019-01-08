import * as jsSHA from 'jssha'
import * as xml2js from 'xml2js'
import { User } from '../entities/user'
import { UserService } from './user'
import { MovieService } from './movie'
import * as express from 'express' 
import { Config } from '../config'
import axios from 'axios'

export class WechatService {
  /**
   * 微信验证
   */
  public static authorize(
    signature: string, 
    timestamp: string, 
    nonce: string): boolean {
    // 将token、timestamp、nonce三个参数进行字典序排序
    const token = 'zouyifeng'
    const array = [token, timestamp, nonce]
    array.sort()
    
    // 将三个参数字符串拼接成一个字符串进行sha1加密    
    var tempStr = array.join('')
    var shaObj = new jsSHA('SHA-1', 'TEXT')
    shaObj.update(tempStr)
    var scyptoString = shaObj.getHash('HEX')
    return signature === scyptoString
  }
  /**
   * 处理微信信息
   */
  public static dealWechatMessage(reqData: string, res: express.Response) {
    const parser = new xml2js.Parser()
    parser.parseString(reqData.toString(), function (err, result) {
      if (result && result.xml) {
        parser.parseString(reqData.toString(), function (err, result) {
          if (result && result.xml) {
            const body = result.xml
            const msgType = body.MsgType[0]
            switch(msgType) {
              case 'event':
                this.dealWechatEvent(body, res)
                break;
              case 'text':
                this.dealWechatText(body, res)
                break;
            }
          }
        })
      }
    })    
  }

  /**
   * 处理事件类型的微信信息
   * @param body 
   * @param req 
   */
  private dealWechatEvent(body, res) {
    if (body.Event[0] === 'subscribe') {
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
  }

  /**
   * 处理文字类型的微信信息
   * @param body 
   * @param res 
   */
  private dealWechatText(body, res) {
    if (body.MsgType[0] === 'text') {
      MovieService.findLastestMovie().then((result: any) => {
        let resultTpl = ''
        for (let i = 0; i < result.length; i++) {
          resultTpl += _tpl(result[i])
        }
        function _tpl (movie) {
          const tpl = `电影名： ${movie.title}
简介：${movie.intro}

`
          return tpl;
        }
        
        var xmlContent = `<xml><ToUserName><![CDATA[${body.FromUserName[0]}]]></ToUserName>
            <FromUserName><![CDATA[${body.ToUserName[0]}]]></FromUserName>
            <CreateTime>" + new Date().getTime() + "</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${resultTpl}]]></Content></xml>`
        res.send(xmlContent);
      })
    }
  }

  /**
   * 获取access token
   */
  public static getAccessToken() {
    const appId: string = Config.APP_ID;
    const appSecret: string = Config.APP_SECRET;
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    axios.get(url).then(res => console.log(res))
  }

  /**
   * 
   */
  public static async typingStatus() {
    const appSecret: string = Config.APP_SECRET; //?
    const url = `https://api.weixin.qq.com/cgi-bin/messa?ge/custom/typing?access_token=16_qhETXMTfgnQIYVbyLWRZb1jT3CWwiZEDfHMeUsI0uIXgsg2tG7fPiVqvnBDpyk7XsXAbyuXvKQM22OenWOrC0wiwOEC-aPVAKL6KTFa8OzJC9MlFYbJASPKplG39LlUZchsd31Wu0L6x-hd1KPHhAFAXCU`
    axios.post(url, {
      touser: 'o0Wzp5gALtFs9xFe-dPAKxxk2-iM',
      command: 'Typing'
    }).then(res => console.log(res.data))
  }
}