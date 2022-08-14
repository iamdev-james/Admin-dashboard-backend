const express = require('express');
const connect_DB = require('./DB_con');
const routerLink  = require('./api/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

// Socket setup
const { Server } = require('socket.io');


const PORT = 5000;
// Initailising Express
const app = express();

// Connecting to a MONGO DB server
// connect_DB();

app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Getting Router links
app.use('/',routerLink);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Oops, Not found');
  error.status = 404;
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message
  })
})

// Port
const port = process.env.PORT || PORT;
// Setting up my server 
const server = app.listen(port, (err) => {
  if (err) {
    console.log("An error occured")
  }
  console.log("Server is up and running on port " + port)
})

// socket setup
const io = new Server(server, {
  cors: {
    origin: "https://mydevvyadmindashboard.vercel.app"
  }
});

io.on('connection', socket => {
  socket.on('chat', data => {
    io.sockets.emit('chat', data)
  })

  // Broadcast typing
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data)
  })
});
