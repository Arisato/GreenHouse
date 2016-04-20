(function(){

	var fetchValue = function(id){
		return document.getElementById(id);
	};

	var textarea = fetchValue('textMessage');
	var userName = fetchValue('user');
	var chatMessages = fetchValue('chatMsgs');

	if(socket !== undefined){
		socket.on('output', function(data){

			var userMessage = document.createElement('div');
			userMessage.setAttribute('id', 'message');
			userMessage.textContent = data.name + ': ' + data.message;
			chatMessages.appendChild(userMessage);
			chatMessages.insertBefore(userMessage, chatMessages.lastChild);
			chatMessages.scrollTop = chatMessages.scrollHeight;
		});

		textarea.addEventListener('keydown', function(event){
			
			var name = userName.value;
			var textInput = this;
			
			if(event.which === 13 && event.shiftKey === false){
				event.preventDefault();
				socket.emit('input' , {name: name, message: textInput.value});
				textarea.value = '';
			}
		});
	}

})();