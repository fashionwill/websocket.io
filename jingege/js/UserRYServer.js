function AjaxGetData(obj){
	var myret = {};
	var userret = {};
	$.ajax({
	    url:'http://admin.piu488.com/index.php?s=/Home/chat/index',
	    type:"post",
	    dataType:"json",
	    data :[
	        {"name":"id","value":getCookie("member_id")},
	        {"name":"token","value":getCookie("token")},
	        {"name":"userid","value":getQueryString("member_id")}
	    ],
	    success:function(res){
	        if(res.code == "2" && res.status == "no"){
	            window.location = '/jingege/login.html';
	        }else if(res.code == "1"){
	            $("#titlename").text(res.data.userret.user_name);
	            myret = res.data.myret;
	            userret = res.data.userret;
	        }else{
	            mui.toast(res.message)
	        }
	        
	    }
	})

	$.ajax({
	    url:'http://admin.piu488.com/index.php?s=/Home/chat/getToken',
	    type:"post",
	    dataType:"json",
	    data :[
	        {"name":"id","value":getCookie("member_id")},
	        {"name":"token","value":getCookie("token")}
	    ],
	    success:function(res){
	    	var getthonk=res.data.token;
	        var getid=res.data.userId
	        websocketfn(getthonk,getid,myret,userret)
	    }
	})
}
AjaxGetData();
function websocketfn(getthonk,getid,myret,userret){
	var config = {};
	var token = getthonk;
	RongIMClient.init("vnroth0kv4u5o",null,config);
	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
		    switch (status) {
		        case RongIMLib.ConnectionStatus["CONNECTED"]:
		        case 0:
		        	console.log("连接成功")
		            break;

		        case RongIMLib.ConnectionStatus["CONNECTING"]:
		        case 1:
		        	console.log("连接中")
		            break;

		        case RongIMLib.ConnectionStatus["DISCONNECTED"]:
		        case 2:
		        	console.log("当前用户主动断开链接")
		            break;

		        case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
		        case 3:
		        	console.log("网络不可用")
		            break;

		        case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
		        case 4:
		        	console.log("未知原因，连接关闭")
		            break;

		        case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
		        case 6:
		        	console.log("用户账户在其他设备登录，本机会被踢掉线")
		            break;

		        case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
		        case 12:
		        	console.log("当前运行域名错误，请检查安全域名配置")
		            break;
		    }
		}
	});
	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
			var event = message.content.content[0];
			$("#video_sms_list").append('<li class="clearfix"><span class="userpic youPic" id="UserImg"></span><div class="UserCommInfo YouChatInfo">'+event+'</div></li>');
		}
	});
	var conversationtype = RongIMLib.ConversationType.PRIVATE;
	var targetId = userret.user_id;
	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			console.log("链接成功，用户id：" + userId);
		},
		onTokenIncorrect: function() {
			console.log('token无效');
		},
		onError:function(errorCode){
			console.log(errorCode);
		}
	});
	//发送消息按钮
	function sendTextMessage(event){
		var pushData = "pushData" + Date.now();
		var isMentioned = false;
		var content = {
			content: [event],
			user : myret
		};
		var msg = new RongIMLib.TextMessage(content);
		var start = new Date().getTime();
		RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
	        onSuccess: function (message) {
	        	$("#video_sms_list").append('<li class="clearfix"><span class="userpic myPic" style="background:url('+myret.my_img+')"></span><div class="UserCommInfo MyChatInfo">'+event+'</div></li>');
	    		// localStorage.setItem('key', JSON.stringify(html));
			    $("#send_msg_text").val("");
	        },
	        onError: function (errorCode,message) {
	        	console.log(message);
	        }
	    }, isMentioned, pushData);
	};

	$("#discuss-button").on("touchstart",function(){
		if($("#send_msg_text").val() != ""){
			sendTextMessage($("#send_msg_text").val());
		}else{
			mui.toast("发送内容消息不能为空!");
		}
	});

	//图片上传
    $("#showPreview").on("change",function(source){
        var file = this.files[0];
        //判断类型是不是图片 
        if(!/image\/\w+/.test(file.type)){    
            alert("请上传图像类型的文件");  
            return false;  
        }  
        if(window.FileReader) {  
            var fr = new FileReader();  
            fr.onloadend = function(e) {
            	console.log()
            	if(e.total/1024 < 100){
            		var file_html = e.target.result;
                	onloadPic(file_html);
            	}else{
            		mui.toast("因网络有限，请上传小于100kb的图片!");
            	}
            };
            fr.onprogress = function(argument) {
                
            }
            fr.readAsDataURL(file);  
        }

        function onloadPic(picUrl){
            var content = {
                imageUri: '<img style="display:block;width:100%" src="'+picUrl+'" alt="">', 
                content: picUrl
            };
            var msg = new RongIMLib.ImageMessage(content);
            RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                onSuccess: function (message) {
                    var contentDiv = '<li class="clearfix"><span class="userpic myPic" id="UserImg"></span><div class="UserCommInfo MyChatInfo">'+message.content.imageUri+'</div></li>';
                    $("#video_sms_list").append(contentDiv);
                }
            });
        }
    });
    
}
