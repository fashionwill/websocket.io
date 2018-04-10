var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
    res.sendFile(__dirname + '/public/recordAudio.html');
});

http.listen(3005, function(){
    console.log('Server is starting on port 3005.')
});

// 在线用户
var onlineUsers = {};

// 当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){
    socket.on('login', function (obj) {
        socket.name = obj.userid;
        if(!onlineUsers.hasOwnProperty(obj.userid)){
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;
        }
        io.emit('login', {
            onlineUsers: onlineUsers,
            onlineCount: onlineCount,
            user: obj
        })
    });

    socket.on('disconnect', function(){
        if(onlineUsers.hasOwnProperty(socket.name)){
            var obj = {
                userid: socket.name,
                username: onlineUsers[socket.name]
            }
            delete onlineUsers[socket.name];
            onlineCount--;
            io.emit('logout', {
                onlineUsers: onlineUsers,
                onlineCount: onlineCount,
                user: obj
            })
        }
    });

    socket.on('message', function(obj){
        io.emit('message', obj);
    });

    setInterval(tick, 1000);
});

function tick() {
    var now = new Date().toUTCString();
    console.log(now);
    io.emit('time', now);
}