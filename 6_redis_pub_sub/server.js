var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require("redis");

server.listen(8000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Create Pub/Sub redis clients
var pub = redis.createClient();
var sub = redis.createClient();

sub.subscribe('chat');

var chat = io.of('/chat');
chat.on('connection', function (socket) {
	// Publish a message from client into Redis 'chat' channel
	socket.on('new message', function (data) {
		pub.publish('chat', JSON.stringify(data))
	});
});

// Listen any message from Redis 'chat' channel and send it to client
sub.on('message', function(channel, message) {
	chat.emit(channel, JSON.parse(message));
});