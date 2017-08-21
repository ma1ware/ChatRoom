$(function() {
	var localusers = [];

	$('#name').focus();
	$('#adduserform').submit(function() {
		var name = $('#name').val();
		$('name').val('');

	 	var socket = io();
	 	socket.on('adduser-todom', function(users) {
	 		users.forEach(function( value, index ) {
	 			if (!~localusers.indexOf(value.name)) {
	 				addUser(value.name, value.flag, name);
	 			}
	 		});
	 	});

	 	socket.on('user-disconnect', function(user) {
	 		removeUser(user.name, user.flag);
	 	});

		socket.emit('adduser', name);

		$('.model').addClass('hidden');

		socket.on('send-message-todom', function(msg) {
			sendMessage(msg, name);
		});

		$('#message').focus();

		$('#sendmessage').on('click', function(event) {
			event.preventDefault();

			var message = $('#message').val();

			if (message.trim() !== '') {
				socket.emit('send-message', {name: name, message: message});
			}
			$('#message').val('');
			$('#message').focus();
		});

		return false;
	});


	function addUser(name, flag, selfname) {
		localusers.push(name);

		var result = name === selfname? "user " + flag + " self" : "user " + flag;
		$('.user-list').append($('<div></div>').addClass(result)
												.html('<img src="imgs/default.jpg" alt="user img">' + 
													'<p class="username">' + name + '</p>'));
	}

	function removeUser(name, flag) {
		var index = localusers.indexOf(name);
		localusers.splice(index, 1);
		$('.' + flag).remove();
	}

	function sendMessage(msg, selfname) {
		var element = document.createElement('div');
		element.classList.add('info');

		if (selfname === msg.name) {
			element.classList.add('myself');
		}

		element.innerHTML = '<p class="author">' + stripscript(msg.name) +
				'</p><div class="message">' + stripscript(msg.message) + '</div>';
		$('.content-area').append(element);
		element.scrollIntoView(false);
	}
});

function stripscript(s) 
{ 
var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")        //格式 RegExp("[在中间定义特殊过滤字符]")
var rs = ""; 
for (var i = 0; i < s.length; i++) { 
 rs = rs+s.substr(i, 1).replace(pattern, ''); 
}
return rs;
}
