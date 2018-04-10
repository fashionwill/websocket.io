var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/webtoken.html');
    res.sendFile(__dirname + '/public/usertoken.html');
});

http.listen(3006, function(){
    console.log('Server is starting on port 3006.')
});