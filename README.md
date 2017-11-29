# wechatOauthJSSDk 
  1.微信授权和JSSDK签名模块
  
# 所需依赖
  1.服务端  express<br/>
  2.异步请求  request<br/>
  3.缓存 memory-cache<br/>
  4.加密模块 crypto<br/>
  
# 使用方法
<pre>

let express = require('express'),
    app = express();
    wechatOauthJSSDk = require('./wechat/wechat'),
    crypto = require('crypto'), //加密模块
    cache = require('memory-cache'), //缓存
    request = require('request'); //异步请求模块
    app.use(express.static('www'));
    
wechatOauthJSSDk = new wechatOauthJSSDk(wxConfig);
let wxConfig = {
      host: "http://xxxx.com",
      appid: "公众号APPID",
      appsecret: "公众号appsecret",
      noncestr: "随机字符串",// 默认 U9QPiKjfV8869MmQWRT5du
      expirytime: 1000 * 60 * 60 * 2 // 默认2小时
}

app.get('/oauth', wechatOauthJSSDk.oauth.bind(wechatOauthJSSDk));//获取授权信息
app.post('/wxConfigSDK', wechatOauthJSSDk.JSSDK.bind(wechatOauthJSSDk));//获取JSSDK

app.listen(8899, () => { console.log("端口：8899") });
