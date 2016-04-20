var client = require('socket.io').listen(7001).sockets;

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