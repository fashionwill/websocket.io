
//express_demo.js 文件
var express = require('express');
var request = require('request');  //<span style="color:#cc6600;">请求页面的服务 必要的</span>
var sha1=require('sha1');  // <span style="color:#cc0000;">签名服务必要的</span>
var app = express();
var noncestr="asdasdasdasd";
var timestamp=2222222;
var page='http://www.dlinead.com';
var url="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=wx_card"
app.get('/', function (req, res) {
	res.send('Hello World');
})
request.get(url, function (error, response, body) {
	var data=JSON.parse(body);//<span style="color:#cc0000;">解析为一个对象不解析就是字符串</span>
	//获取jsapi_ticket
	//https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
	//'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token.access_token + '&type=jsapi';
	request.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+data.access_token+'&type=jsapi',function(error, response, body){
		var ticket=JSON.parse(body).ticket
		console.log(ticket);
		var string = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '×tamp=' + timestamp + '&url=' + page;
		var signature=sha1(string); //获得签名 
		console.log(signature);
	})
	//console.log(data.access_token)
})
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	//console.log("应用实例，访问地址为 http://%s:%s", host, port)

})