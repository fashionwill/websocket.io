(function () {

    window.CHAT = {
        msgObj: document.getElementById("message"),
        userid: null,
        username: null,
        socket: null,
        //让浏览器滚动条保持在最低部
        scrollToBottom: function() {
            window.scrollTo(0, this.msgObj.clientHeight);
        },
        //退出，本例只是一个简单的刷新
        logout: function() {
            //this.socket.disconnect();
            location.reload();
        },
        genUid: function(){
          return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100)
        },
        //提交聊天消息内容
        submit: function() {
            var content = document.getElementById("content").value;
            if (content != '') {
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', obj);
                document.getElementById("content").value = '';
            }
            return false;
        },

        usernameSubmit: function () {
            var username = document.getElementById('username').value;
            if(username !== ""){
                document.getElementById('username').value = '';
                document.getElementById('loginbox').style.display = 'none';
                document.getElementById('chatbox').style.display = 'block';
                this.init(username);
            }
        },
        updateSysMsg: function(o, action){
            var onlineUsers = o.onlineUsers;
            var onlineCount = o.onlineCount;
            var user = o.user;

            var userhtml = '';
            var separator = '';
            for(var key in onlineUsers){
                if(onlineUsers.hasOwnProperty(key)){
                    userhtml += separator + onlineUsers[key];
                    separator = '、';
                }
            }
            document.getElementById("onlinecount").innerHTML = '当前共有 ' + onlineCount + ' 人在线，在线列表：' + userhtml;
            //添加系统消息
            var html = '';
            html += '<div class="msg-system">';
            html += user.username;
            html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
            html += '</div>';
            var section = document.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
            this.scrollToBottom();
        },
        init: function(username){
            //生成用户唯一ID
            this.userid = this.genUid();
            this.username = username;
            document.getElementById('showusername').innerHTML = this.username;
            // this.scrollToBottom();
            this.socket = io.connect();
            this.socket.emit('login', {
                userid: this.userid,
                username: this.username
            });
            this.socket.on('login', function(o){
                CHAT.updateSysMsg(o, 'login');
            });
            //监听用户退出
            this.socket.on('logout', function(o) {
                CHAT.updateSysMsg(o, 'logout');
            });
            //监听消息发送
            this.socket.on('message', function(obj) {
                var isme = (obj.userid == CHAT.userid) ? true : false;
                var contentDiv = '<div>' + obj.content + '</div>';
                var usernameDiv = '<span>' + obj.username + '</span>';

                var section = document.createElement('section');
                if (isme) {
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgObj.appendChild(section);
                CHAT.scrollToBottom();
            });

        }
    }
    // 提交用户名
    document.getElementById('username').onkeydown = function(e){
        e = e || event;
        if(e.keyCode === 13){
            CHAT.usernameSubmit();
        }
    }
    //通过“回车”提交信息
    document.getElementById("content").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    };


    // var SetFaceRes = document.getElementById('SetFaceRes');
    // var SetAddRes = document.getElementById('SetAddRes');
    // var text_input = document.querySelector(".text_input .input");
    // var setvoiceitem = document.querySelector(".text_input .setvoiceitem");
    // document.getElementById("clickSetVoice").onclick = function(e) {
    //     if(this.className.indexOf("active") != -1){
    //         this.className = "conn_btn voice_btn";
    //         text_input.style.display = "block";
    //         setvoiceitem.style.display = "none";
    //     }else{
    //         this.className = "conn_btn voice_btn active";
    //         setvoiceitem.style.display = "block";
    //         text_input.style.display = "none";
    //     }
    //     SetAddRes.style.display="none";
    //     SetFaceRes.style.display="none";
    // };
    // document.getElementById("clickSetFace").onclick = function(e) {
    //     SetAddRes.style.display="block";
    //     SetFaceRes.style.display="none";
    //     text_input.style.display = "block";
    //     setvoiceitem.style.display = "none";
    // };
    // document.getElementById("clickSetAdd").onclick = function(e) {
    //     SetFaceRes.style.display="block";
    //     SetAddRes.style.display="none";
    //     text_input.style.display = "block";
    //     setvoiceitem.style.display = "none";
    // };

})()