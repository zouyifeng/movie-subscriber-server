import * as express from 'express'
import * as jsSHA from 'jssha'


class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    // router.get('/', (req, res) => {
    //   console.log('in')
    //   res.json({
    //     message: 'Hello World!'
    //   })
    // })
    router.get('/', (req, res) => {
      console.log('in')
      const token = 'zouyifeng'
      const signature = req.query.signature,    //微信加密签名
	        timestamp = req.query.timestamp,    //时间戳
	            nonce = req.query.nonce,    //随机数
            echostr = req.query.echostr;    //随机字符串
      //2.将token、timestamp、nonce三个参数进行字典序排序
	    var array = [token,timestamp,nonce];
	    array.sort();

	    //3.将三个参数字符串拼接成一个字符串进行sha1加密
	    var tempStr = array.join('');
	    var shaObj = new jsSHA('SHA-1', 'TEXT');
	    shaObj.update(tempStr);
      var scyptoString = shaObj.getHash('HEX'); 
      
      //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
	    if(signature === scyptoString){
	    	console.log('验证成功')
	        res.send(echostr);
	    }else{
	    	console.log('验证失败')
	        res.send('验证失败');
	    }
    })
    this.express.use('/', router)
  }
}

export default new App().express
