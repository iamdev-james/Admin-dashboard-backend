const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Package for parsing images and also the destination to store the images uploladed
const uploads = multer({dest: 'uploads/writers/'})
require('dotenv').config();

const { JWT_SECRET_KEY } = process.env

const app = express();  

app.use(express.json());


// Creating new user 
app.post('/signup', async(req, res) => {
  // Check if username or Email exists
  const foundUser = await User.findOne({ "$or": [ { email: req.body.email }, { username: req.body.username} ] });
  // Validate Email and Password
  if (foundUser) {
    res.status(409).json({
      message: "Ooops, This email or username has been registered before"
    })
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({
          error: err
        })
      } else {
          const user = new User ({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            description: req.body.description,
            password: hash,
            joinedAt: req.body.joinedAt
          })
          user.save()
          .then((userData) => {
              res.status(201).json({
                message: 'User was successfully registered',
                userData
              })
            })
            .catch(err => {
              res.status(500).json({
                error: err
            })
        })
      }
    })
  }
})

// Signing in Existing user
app.post('/login', async(req, res) => {
  const foundUser = await User.findOne( {email: req.body.email} );
  try {
    if (foundUser)  {
      bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
        if (!result) {
          res.status(404).json({
            message: 'Auth failed, wrong password'
          })
        } else if (result) {
          const userToken = jwt.sign(
            {
              email: foundUser.email,
              userId: foundUser._id
            },
              JWT_SECRET_KEY,
            {
              expiresIn: '2h'
            }
          );
          res.status(200).json({
            message: 'User Authenticated',
            token: userToken
          })
        }
      })
    } else {
      res.status(404).json({
        message: 'Mail not found, user doesn\'t exist'
      })
    }
  } catch (err) {
    res.status(401).json({
      message: 'Authentication failed'
    })
  }
})
module.exports = app;
