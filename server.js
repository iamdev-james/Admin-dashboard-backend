const express = require('express');
const connect_DB = require('./DB_con');
const routerLink  = require('./api/routes');
const bodyParser = require('body-parser');
require('dotenv').config();


const { PORT } = process.env
// Initailising Express
const app = express();

// Connecting to a MONGO DB server
connect_DB();

app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS error
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST,DELETE, GET")
//     return res.status(200).json({})
//   }
// })

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
app.listen(port, (err) => {
  if (err) {
    console.log("An error occured")
  }
  console.log("Server is up and running on port " + port)
})