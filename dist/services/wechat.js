"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsSHA = require("jssha");
const xml2js = require("xml2js");
const user_1 = require("../entities/user");
const user_2 = require("./user");
const movie_1 = require("./movie");
const config_1 = require("../config");
const axios_1 = require("axios");
exports.WechatService = {
    /**
     * 微信验证
     */
    authorize: (signature, timestamp, nonce) => {
        // 将token、timestamp、nonce三个参数进行字典序排序
        const token = 'zouyifeng';
        const array = [token, timestamp, nonce];
        array.sort();
        // 将三个参数字符串拼接成一个字符串进行sha1加密    
        var tempStr = array.join('');
        var shaObj = new jsSHA('SHA-1', 'TEXT');
        shaObj.update(tempStr);
        var scyptoString = shaObj.getHash('HEX');
        return signature === scyptoString;
    },
    /**
     * 处理微信信息
     */
    dealWechatMessage: (reqData, res) => {
        const parser = new xml2js.Parser();
        parser.parseString(reqData.toString(), function (err, result) {
            if (result && result.xml) {
                parser.parseString(reqData.toString(), function (err, result) {
                    if (result && result.xml) {
                        const body = result.xml;
                        const msgType = body.MsgType[0];
                        switch (msgType) {
                            case 'event':
                                exports.WechatService.dealWechatEvent(body, res);
                                break;
                            case 'text':
                                exports.WechatService.dealWechatText(body, res);
                                break;
                            default:
                                res.send('success');
                                break;
                        }
                    }
                });
            }
        });
    },
    /**
     * 处理事件类型的微信信息
     * @param body
     * @param req
     */
    dealWechatEvent: (body, res) => {
        if (body.Event[0] === 'subscribe') {
            let user = new user_1.User();
            user.open_id = body.FromUserName[0];
            user_2.UserService.newUser(user);
            var xmlContent = `<xml><ToUserName><![CDATA[${body.FromUserName[0]}]]></ToUserName>
                        <FromUserName><![CDATA[${body.ToUserName[0]}]]></FromUserName>
                        <CreateTime>" + new Date().getTime() + "</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[嘻嘻嘻，欢迎光临]]></Content></xml>`;
            res.send(xmlContent);
        }
        else if (body.Event[0] === 'CLICK') {
            exports.WechatService.sendNewMovieTplMsg(body.FromUserName[0]);
        }
        else {
            res.send('success');
        }
    },
    /**
     * 处理文字类型的微信信息
     * @param body
     * @param res
     */
    dealWechatText: (body, res) => {
        if (body.MsgType[0] === 'text') {
            movie_1.MovieService.findLastestMovie().then((movie) => {
                let resultTpl = '';
                resultTpl = `电影名： ${movie.title}
简介：${movie.intro}

`;
                var xmlContent = `<xml><ToUserName><![CDATA[${body.FromUserName[0]}]]></ToUserName>
            <FromUserName><![CDATA[${body.ToUserName[0]}]]></FromUserName>
            <CreateTime>" + new Date().getTime() + "</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${resultTpl}]]></Content></xml>`;
                res.send(xmlContent);
            });
        }
    },
    /**
     * 获取access token
     */
    getAccessToken: () => __awaiter(this, void 0, void 0, function* () {
        let accessToken = '';
        const appId = config_1.Config.APP_ID;
        const appSecret = config_1.Config.APP_SECRET;
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
        yield axios_1.default.get(url).then((res) => {
            accessToken = res.data.access_token;
        });
        return accessToken;
    }),
    /**
     * 显示正在打印的状态
     */
    typingStatus: () => __awaiter(this, void 0, void 0, function* () {
        const appSecret = config_1.Config.APP_SECRET; //?
        const url = `https://api.weixin.qq.com/cgi-bin/messa?ge/custom/typing?access_token=16_qhETXMTfgnQIYVbyLWRZb1jT3CWwiZEDfHMeUsI0uIXgsg2tG7fPiVqvnBDpyk7XsXAbyuXvKQM22OenWOrC0wiwOEC-aPVAKL6KTFa8OzJC9MlFYbJASPKplG39LlUZchsd31Wu0L6x-hd1KPHhAFAXCU`;
        axios_1.default.post(url, {
            touser: 'o0Wzp5gALtFs9xFe-dPAKxxk2-iM',
            command: 'Typing'
        }).then(res => console.log(res.data));
    }),
    /**
     * 发送收到新电影的模板消息
     */
    sendNewMovieTplMsg: (openIdFromEvent) => __awaiter(this, void 0, void 0, function* () {
        const access_token = yield exports.WechatService.getAccessToken();
        let openId;
        if (!openIdFromEvent) {
            openId = yield user_2.UserService.findAllUser();
        }
        else {
            openId = [{ open_id: openIdFromEvent }];
        }
        const lastestMovie = yield movie_1.MovieService.findLastestMovie();
        //发送模板消息的接口
        const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
        for (let i = 0; i < openId.length; i++) {
            //发送模板消息的数据
            const requestData = {
                touser: openId[i].open_id,
                template_id: config_1.Config.NEW_MOVIE_TPL_MSG_ID,
                url: 'http://m.zouyifeng.xyz/wechat-page',
                data: {
                    name: {
                        value: lastestMovie.title,
                        color: "#173177"
                    },
                    type: {
                        value: lastestMovie.type,
                        color: "#173177"
                    },
                    rate: {
                        value: lastestMovie.rate,
                        color: "#173177"
                    }
                }
            };
            axios_1.default(url, {
                method: 'post',
                data: requestData,
            }).then((res) => {
                if (res.status == 200) {
                    console.log('模板消息推送成功');
                }
            });
        }
    })
};
//# sourceMappingURL=wechat.js.map