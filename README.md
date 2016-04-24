# Socket.io

## Installing

```bash
$ npm install socket.io
```

## API

### Server

Exposed by `require('socket.io')`.

#### Server()

Creates a new Server.

```bash
var io = require('socket.io')();
// or
var Server = require('socket.io');
var io = new Server();
```

### Socket

A `Socket` is the fundamental class for interacting with browser clients. A Socket belongs to a certain Namespace (by default `/`) and uses an underlying `Client` to communicate.

#### socket.id:String

A unique identifier for the socket session, that comes from the underlying `Client`.

#### socket.emit(name:String[, data:Object, ...]):Socket

Emits an event to the socket identified by the string `name`.

```javascript
socket.emit('an event', { some: 'data' });
```

#### socket.on(name:String, callback:Function)

Listens for event from the socket identified by the string `name`.

```javascript
socket.on('an event', function(data) {
  console.log(data.some);
});
```

#### socket.send(data:Object)

Send a `message` event.

```javascript
// Client
socket.send('hi!');

// Server
socket.on('message', function(data) {
  console.log(data);
});
```
#### socket.join(name:String[, fn:Function]):Socket

Adds the socket to the `room`, and fires optionally a callback `fn` with `err` signature (if any).

The socket is automatically a member of a room identified with its session id (see `socket.id`).

The mechanics of joining rooms are handled by the Adapter.

```javascript
socket.join('general');
```

#### socket.leave(name:String[, fn:Function]):Socket

Removes the socket from `room`, and fires optionally a callback `fn` with `err` signature (if any).

Rooms are left automatically upon disconnection.

The mechanics of leaving rooms are handled by the Adapter that has been configured (see Server#adapter above), defaulting to socket.io-adapter.

```javascript
socket.leave('general');
```

#### socket.broadcast.emit(name:String[, data:Object, ...])

Broadcasting means sending a message to everyone else except for the socket that starts it.

```javascript
io.on('connection', function (socket) {
  socket.broadcast.emit('user connected');
});
```

#### socket.volatile.emit(name:String[, data:Object, ...])

Does not always respond to the client in cases of network slowness or other issues, or because the user is connected through long polling and is in the middle of request-response cycle.

```javascript
socket.volatile.emit('last tweet', tweet);
```

### Namespaces

Socket.IO allows you to "namespace" your sockets, which essentially means assigning different endpoints or paths.

This is a useful feature to minimize the number of resources (TCP connections) and at the same time separate concerns within your application by introducing separation between communication channels.

#### Default namespace

We call the default namespace / and it’s the one Socket.IO clients connect to by default, and the one the server listens to by default.

This namespace is identified by io.sockets or simply io.

#### Broadcasting to all clients in default namespace

```javascript
// the following two will emit to all the sockets connected to `/`
io.sockets.emit('hi', 'everyone');
io.emit('hi', 'everyone'); // short form
```

#### Handle connection event for default namespace

Each namespace emits a connection event that receives each Socket instance as a parameter

```javascript
io.on('connection', function(socket){
  socket.on('disconnect', function(){ });
});
```

### Custom Namespaces

To set up a custom namespace, you can call the of function on the server-side:

```javascript
var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected'):
});
nsp.emit('hi', 'everyone!');
```
On the client side, you tell Socket.IO client to connect to that namespace:

```javascript
var socket = io('/my-namespace');
```

### Rooms

Within each namespace, you can also define arbitrary channels that sockets can join and leave.

#### Joining and leaving

You can call join to subscribe the socket to a given channel:

```javascript
io.on('connection', function(socket){
  socket.join('some room');
});
```

And then simply use to or in (they are the same) when broadcasting or emitting:

```javascript
io.to('some room').emit('some event'):
```

To leave a channel you call leave in the same fashion as join.

#### Default room

Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id. For your convenience, each socket automatically joins a room identified by this id.

This makes it easy to broadcast messages to other sockets:

```javascript
io.on('connection', function(socket){
  socket.on('say to someone', function(id, msg){
    socket.broadcast.to(id).emit('my message', msg);
  });
});
```

#### Disconnection

Upon disconnection, sockets leave all the channels they were part of automatically, and no specially teardown is needed on your part.

### Middlewares

A middleware is a function that gets executed for every incoming Socket and receives as parameter the socket and a function to optionally defer execution to the next registered middleware. Useful for authentication.

```javascript
io.use(function(socket, next){
  if (socket.request.headers.cookie == 'valid_session_id') {
    next();
  } else {
    next(new Error('not authorized'));
  }
});
```

#### Namespace authorization?

```javascript
io.of('/namespace').use(function(socket, next) {
  var handshakeData = socket.request;
  next();
});
```

## Examples

| Samples                            |
| ---------------------------------- |
| 1_getting_started_standalone       |
| 2_getting_started_node_http_server |
| 3_getting_started_express          |
| 4_chat                             |
| 5_namespaces                       |

# Links

- [Socket.IO project](https://github.com/socketio/socket.io)
- [Socket.IO docs](http://socket.io/docs)
- [WebSocket and Socket.IO](https://davidwalsh.name/websocket)
- [Real-time Django notifications with node.js, socket.io and Redis](http://www.machinalis.com/blog/rt-django-notifications/)
- [Adding Real-Time to a RESTful Rails App](http://liamkaufman.com/blog/2013/02/27/adding-real-time-to-a-restful-rails-app/)
- [Socket.IO on PubNub](https://www.pubnub.com/socket.io/)
- [Creating a private chat between a key using a node.js and socket.io](http://stackoverflow.com/questions/23619015/creating-a-private-chat-between-a-key-using-a-node-js-and-socket-io)
- [Sending messages to certain clients](https://michaelheap.com/sending-messages-to-certain-clients-with-socket-io/)
- [Send message to specific client with socket.io and node.js](http://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js)
- [What should I be using? Socket.io rooms or Redis pub-sub?](http://stackoverflow.com/questions/14929700/what-should-i-be-using-socket-io-rooms-or-redis-pub-sub)
- [Token-based Authentication with Socket.IO](https://auth0.com/blog/2014/01/15/auth-with-socket-io/)
- [Better authentication for socket.io ](https://facundoolano.wordpress.com/2014/10/11/better-authentication-for-socket-io-no-query-strings/)
- [Redis + Node.js + Socket.IO – Event-driven, subscription-based broadcasting](https://codesachin.wordpress.com/2015/06/27/redis-node-js-socket-io-event-driven-subscription-based-broadcasting/)
- [Chat based on Node.js using Redis Pub/Sub + socket.io](https://github.com/steffenwt/nodejs-pub-sub-chat-demo)