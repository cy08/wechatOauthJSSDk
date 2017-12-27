let crypto = require('crypto'), //加密模块
    cache = require('memory-cache'), //缓存
    request = require('request'); //异步请求模块
let sha1 = (str) => {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str, 'utf8');
    str = md5sum.digest('hex');
    return str;
}

function wechatOauthJSSDk(opts) {
    this.protocol = opts.protocol || "http";
    this.host = opts.host;
    this.appid = opts.appid;
    this.appsecret = opts.appsecret;
    this.token = opts.token;
    this.noncestr = opts.noncestr || 'U9QPiKjfV8869MmQWRT5du';
    this.expirytime = opts.expirytime || 1000 * 60 * 60 * 2 //两小时失效

}

wechatOauthJSSDk.prototype.oauth = function(req, res) {
    if (!req.query.code) {
        if (!req.query.url) res.send("请填写回调域名");
        let return_uri = encodeURIComponent(this.protocol + "://" + this.host + "/oauth?url=" + req.query.url); // 这是回调URL
        let scope = 'snsapi_userinfo'; //snsapi_base 无需用户确认获取用户信息
        res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect');
    } else {
        // 获取到code
        this.verifiCation(req, res);
    }
}

// 验证接口
wechatOauthJSSDk.prototype.verifiCation = function(req, res) {
    let code = req.query.code;
    let backUrl = req.query.url;
    request.get({ url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + this.appid + '&secret=' + this.appsecret + '&code=' + code + '&grant_type=authorization_code' },
        (error, response, body) => {
            if (response.statusCode == 200) {
                let data = JSON.parse(body);
                let access_token = data.access_token;
                let openid = data.openid;
                request.get({ url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN' }, (error, response, body) => {
                    if (response.statusCode == 200) {
                        // 第四步：根据获取的用户信息进行对应操作
                        body = JSON.parse(body)
                        body.url = backUrl;
                        if (typeof this.oauthSuccess == "function") this.oauthSuccess(body, res);
                        console.log(data.openid)
                        // 判断URL是否本身带有参数
                        backUrl += (backUrl.indexOf("?") != -1) ? "&openi=" + data.openid : "?openi=" + data.openid;
                        res.redirect(backUrl);
                    } else {
                        if (typeof this.oauthError == "function") this.oauthError(response.statusCode, res);
                        console.log(response.statusCode);
                    }
                });
            } else {
                if (typeof this.oauthError == "function") this.oauthError(response.statusCode, res);
                console.log(response.statusCode);
            }
        }
    );
}

wechatOauthJSSDk.prototype.JSSDK = function(req, res) {
    let url = req.headers.referer; //获取请求的URL
    if (cache.get('JSSDK' + url)) {
        res.send(cache.get('JSSDK' + url));
        return false;
    }
    let noncestr = this.noncestr,
        appid = this.appid,
        appsecret = this.appsecret,
        expirytime = this.expirytime,
        timestamp = Math.floor(Date.now() / 1000); //精确到秒

    // 获取签名
    request.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appsecret, (error, response, body) => {
        request.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + JSON.parse(body).access_token + "&type=jsapi", (error, response, body) => {
            let jsapi_ticket = JSON.parse(body).ticket;
            let signature = sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
            var sendData = { appid, jsapi_ticket, noncestr, timestamp, signature };
            cache.put('JSSDK' + url, JSON.stringify(sendData), expirytime); //加入缓存
            res.send(JSON.stringify(sendData))
        })
    });
}
// 获取授权成功回调
wechatOauthJSSDk.prototype.oauthSuccess = null;
// 获取授权失败回调
wechatOauthJSSDk.prototype.oauthError = null;
module.exports = wechatOauthJSSDk;let crypto = require('crypto'), //加密模块
    cache = require('memory-cache'), //缓存
    request = require('request'); //异步请求模块
let sha1 = (str) => {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str, 'utf8');
    str = md5sum.digest('hex');
    return str;
}

function wechatOauthJSSDk(opts) {
    this.protocol = opts.protocol || "http";
    this.host = opts.host;
    this.appid = opts.appid;
    this.appsecret = opts.appsecret;
    this.token = opts.token;
    this.noncestr = opts.noncestr || 'U9QPiKjfV8869MmQWRT5du';
    this.expirytime = opts.expirytime || 1000 * 60 * 60 * 2 //两小时失效

}

wechatOauthJSSDk.prototype.oauth = function(req, res) {
    if (!req.query.code) {
        if (!req.query.url) res.send("请填写回调域名");
        let return_uri = encodeURIComponent(this.protocol + "://" + this.host + "/oauth?url=" + req.query.url); // 这是回调URL
        let scope = 'snsapi_userinfo'; //snsapi_base 无需用户确认获取用户信息
        res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect');
    } else {
        // 获取到code
        this.verifiCation(req, res);
    }
}

// 验证接口
wechatOauthJSSDk.prototype.verifiCation = function(req, res) {
    let code = req.query.code;
    let backUrl = req.query.url;
    request.get({ url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + this.appid + '&secret=' + this.appsecret + '&code=' + code + '&grant_type=authorization_code' },
        (error, response, body) => {
            if (response.statusCode == 200) {
                let data = JSON.parse(body);
                let access_token = data.access_token;
                let openid = data.openid;
                request.get({ url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN' }, (error, response, body) => {
                    if (response.statusCode == 200) {
                        // 第四步：根据获取的用户信息进行对应操作
                        body = JSON.parse(body)
                        body.url = backUrl;
                        if (typeof this.oauthSuccess == "function") this.oauthSuccess(body, res);
                        console.log(data.openid)
                        // 判断URL是否本身带有参数
                        backUrl += (backUrl.indexOf("?") != -1) ? "&openi=" + data.openid : "?openi=" + data.openid;
                        res.redirect(backUrl);
                    } else {
                        if (typeof this.oauthError == "function") this.oauthError(response.statusCode, res);
                        console.log(response.statusCode);
                    }
                });
            } else {
                if (typeof this.oauthError == "function") this.oauthError(response.statusCode, res);
                console.log(response.statusCode);
            }
        }
    );
}

wechatOauthJSSDk.prototype.JSSDK = function(req, res) {
    let url = req.headers.referer; //获取请求的URL
    if (cache.get('JSSDK' + url)) {
        res.send(cache.get('JSSDK' + url));
        return false;
    }
    let noncestr = this.noncestr,
        appid = this.appid,
        appsecret = this.appsecret,
        expirytime = this.expirytime,
        timestamp = Math.floor(Date.now() / 1000); //精确到秒

    // 获取签名
    request.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appsecret, (error, response, body) => {
        request.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + JSON.parse(body).access_token + "&type=jsapi", (error, response, body) => {
            let jsapi_ticket = JSON.parse(body).ticket;
            let signature = sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url);
            var sendData = { appid, jsapi_ticket, noncestr, timestamp, signature };
            cache.put('JSSDK' + url, JSON.stringify(sendData), expirytime); //加入缓存
            res.send(JSON.stringify(sendData))
        })
    });
}
// 获取授权成功回调
wechatOauthJSSDk.prototype.oauthSuccess = null;
// 获取授权失败回调
wechatOauthJSSDk.prototype.oauthError = null;
module.exports = wechatOauthJSSDk;
