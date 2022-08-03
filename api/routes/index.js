const express = require('express');
const valuserRoute = require('./val_user');
const googleAuthRoute = require('./googleAuth');

const app = express();


app.get('/', (req, res) => {
  res.status(200).json({ message: "welcome to the Chat App" })
})

app.use('/', googleAuthRoute);
app.use('/', valuserRoute);

module.exports = app
