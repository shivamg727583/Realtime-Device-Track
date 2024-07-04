
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path=require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);



app.set('view engine','ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));



io.on('connection', (socket) => {
  console.log('socket connected');

  socket.on('send-location', (data) => {
    // console.log(`Location received: ${JSON.stringify(data)} from socket: ${socket.id}`); // Debugging
    io.emit('receive-location', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {

    io.emit("user-disconnected", socket.io);
    console.log('socket disconnected');
  });
});

app.get('/', function (req, res) {
    res.render('index');
  });
  
  

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
