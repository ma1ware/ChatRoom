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
	 				addUser(value.name, value.flag);
	 			}
	 		});
	 	});

	 	socket.on('user-disconnect', function(user) {
	 		removeUser(user.name, user.flag);
	 	});

		socket.emit('adduser', name);

		$('.model').addClass('hidden');

		socket.on('send-message-todom', function(msg) {
			sendMessage(msg);
		});

		$('#message').focus();

		$('#sendmessage').on('click', function(event) {
			event.preventDefault();

			var message = $('#message').val();
			$('#message').val('');
			$('#message').focus();

			socket.emit('send-message', {name: name, message: message});
		});

		return false;
	});


	function addUser(name, flag) {
		localusers.push(name);
		$('.user-list').append($('<div></div>').addClass('user ' + flag)
												.html('<img src="imgs/default.jpg" alt="user img">' + 
													'<p class="username">' + name + '</p>'));
	}

	function removeUser(name, flag) {
		var index = localusers.indexOf(name);
		localusers.splice(index, 1);
		$('.' + flag).remove();
	}

	function sendMessage(msg) {
		var element = document.createElement('div');
		element.classList.add('info');
		element.innerHTML = '<p class="author">' + msg.name +
				'</p><div class="message">' + msg.message + '</div>';
		$('.content-area').append(element);
		element.scrollIntoView(false);
	}
});