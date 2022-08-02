const express = require('express');
const { default: mongoose } = require('mongoose');
const Article = require("../models");

const app = express();

app.use(express.json());

app.post('/:writer/articles', (req, res) => {
  const article = new Article({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    username: req.body.username,
    title: req.body.title,
    subTitle: req.body.subTitle,
    category: req.body.category,
    article: req.body.article,
    createdAt: req.body.createdAt
  })
  article.save().then( result => {
    res.status(200).json({ message: 'Received Successfully' })
  }).catch (err => {
    res.status(500).json({ message: err.message })
  })
 })

// Update article details
app.patch('/:user/article/:id', (req, res) => {
  const artId = req.params.id;
  const updateOps = {};
  for (const ops in req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Article.updateOne({ _id: artId}, { $set: updateOps })
  .then( result => {
    res.status(200).json({
      message: 'Updated successfully',
      result
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: 'An error occured, please try again'
    })
  })
})

// Delete an article
app.delete('/article/:id', (req, res) => {
  const artId = req.params.id;
  Article.deleteOne({ _id: artId })
  .then(result => {
    res.status(200).json({
      message: 'Deleted successfully',
      result
    })
  })
  .catch( err => {
    console.log(err)
    res.status(500).json({
      error: 'An error occured, please try again'
    })
  })
})

module.exports = app
