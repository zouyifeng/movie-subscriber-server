import axios from 'axios'
import { WechatService } from '../services/wechat'

// menu为创建自定义菜单的具体内容，也就是post到微信服务器的body
const menu = {
  "button":[{    
    "type":"click",
    "name":"最新电影",
    "key":"V1001_TODAY_MUSIC"
   }]
}

export const createMenu = async () => {
  const accessToken = await WechatService.getAccessToken()
  const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`
  axios.post(url, menu).then(res => {
    console.log(res.data)
  })
}
