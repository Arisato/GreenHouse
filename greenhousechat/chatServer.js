var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var client = require('socket.io').listen(server);

app.use(express.static(__dirname + "/public"));

server.listen(7001);

// var client = require('socket.io').listen(server).sockets;

// ------------------- socket.io configuration BEGIN ------------------------ //

client.on('connection', function(socket){

  	socket.on('disconnect', function(){
  		console.log('User has disconnected');
  	});

  	socket.on('input', function(data){

  		var name = data.name;
  		var message = data.message;

  			client.emit('output', data);
  	});
});

// ------------------- socket.io configuration END ------------------------ //

console.log("Chat server is running on port 7001");


app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});
