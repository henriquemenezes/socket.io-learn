var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


var chat = io.of('/chat');
chat.on('connection', function (socket) {
	console.log('Connection on Chat by client ' + socket.id);

	socket.emit('a message', {
		msg: 'Only this socket will receive'
	});

	chat.emit('a message', {
		msg: 'Everyone in /chat will receive'
	});

	socket.on('echo', function (data) {
		// For current client
		socket.emit('a message', {
			msg: data.msg
		});
	});

	socket.on('new message', function (data) {
		// Everyone
		chat.emit('a message', {
			msg: data.msg
		});
	});
});

var news = io.of('/news');
news.on('connection', function (socket) {
	console.log('Connection on News by client ' + socket.id);

	socket.emit('item', { news: 'Item to current socket' });

	news.emit('item', { news: 'Item to everyone'});
});
