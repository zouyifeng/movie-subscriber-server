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
const axios_1 = require("axios");
const wechat_1 = require("../services/wechat");
// menu为创建自定义菜单的具体内容，也就是post到微信服务器的body
const menu = {
    "button": [{
            "type": "click",
            "name": "最新电影",
            "key": "V1001_TODAY_MUSIC"
        }]
};
exports.createMenu = () => __awaiter(this, void 0, void 0, function* () {
    const accessToken = yield wechat_1.WechatService.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`;
    axios_1.default.post(url, menu).then(res => {
        console.log(res.data);
    });
});
//# sourceMappingURL=menu.js.map