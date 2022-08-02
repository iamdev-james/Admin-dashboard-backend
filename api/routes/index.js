const express = require('express');
const userRoute = require('./users');
const writerRoute = require('./writers');
const valuserRoute = require('./val_user');
const googleAuthRoute = require('./googleAuth');

const app = express();


app.get('/', (req, res) => {
  res.status(200).json({ message: "welcome to the Article Hub App" })
})

app.use('/', googleAuthRoute);
app.use('/', valuserRoute);
app.use('/', userRoute);
app.use('/', writerRoute);

module.exports = app
