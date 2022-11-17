const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let nicknames=[];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cliente.html');
});

io.on('connection', (socket) => {
   
socket.on('new user',(data,cb) => {
  console.log('Usuario a agregar:' + data);
if(nicknames.indexOf(data)!=-1)
{
  cb(false);
}else{
  cb(true);
  socket.nickname=data;
  nicknames.push(socket.nickname);
  updateNicknames();
}
});

  socket.on('send message', (data) => {
    console.log(data);

   io.emit('new message', {
    msg:data,
    nick:socket.nickname
  });
   //socket.broadcast.emit('chat message',msg);
  });

  console.log('a user connected');
  socket.on('disconnect', data => {
    console.log('user disconnected');
    if(!socket.nickname)return;
    nicknames.splice(nicknames.indexOf(socket.nickname),1);
    updateNicknames();
  });

  function updateNicknames(){
    io.emit('usernames',nicknames);
  }
 
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});