const express = require('express');
const res = require('express/lib/response');
const Articles = require('../models/index');
const Users = require('../models/users');

const app = express();

app.use(express.json());


// Get list of all articles in the homepage
app.get('/articles', (req, res) => {
  Articles.find()
  .select('username title category createdAt _id')
  .then(articles => {
    const resArticles = {
      count: articles.length,
      listedArticles: articles.map( article => {
        return {
          _id: article._id,
          username: article.username,
          title: article.title,
          category: article.category,
          createdAt: article.createdAt,
          request: {
            type: 'GET',
            url: `http://localhost:6000/article/${article._id}`
          }
        }
      })
    }
    res.status(200).json(resArticles);
  })
})


// Get more on a particular article
app.get('/article/:articleId', (req, res) => {
  const Id = req.params.articleId;
  Articles.findById(Id)
  .select('name username title subTitle category article createdAt')
  .then(article => {
    if (article) {
      res.status(200).json({
        Article: article,
        request: {
          type: "GET",
          url: 'http://localhost:6000/articles'
        }
      })
    } else {
      res.status(500).json({
        message: "Invalid Id, Article doesn\'t exist"
      })
    }
  })
  .catch (err => {
    console.log(err.message);
    res.status(500).json({
      message: 'An error occured'
    });
  })
})

// Get all our writers
app.get('/authors', (req, res) => {
  Users.find()
  .select('name username _id')
  .then(writers => {
    if (writers) {
      res.status(200).json({
        count: writers.length,
        writersList: writers.map( writer => {
          return {
            writer: writer,
            request: {
              type: 'GET',
              url: `http://localhost:6000/author/${writer._id}`
            }
          }
        })
      })
    } else {
      res.status(404).json({
        message: 'We don\'t have any writer at the moment'
      })
    }
    // res.status(200).json({
    //   writers: writers,
    //   request: {
    //     type: 'GET',
    //     url: `http://localhost:6000/user/author/${writers}`
    //   }
    // })
  })
  .catch( err => {
    res.status(500).json({
      message: 'Failed, please try again'
    })
  })
})

app.get('/author/:id', (req, res) => {
  Users.findById(req.params.id)
  .select('name email username description password joinedAt _id')
  .then(writer => {
    if(writer) {
      res.status(200).json({
        message: 'Found writer',
        writer: writer,
        articlesByWriter: {
          request : {
            type: 'GET',
            url: ''
          }
        }
      })
    }
  })
})

// Get all articles by an author
app.get('/:author/articles', (req, res) => {
  const username = req.params.author;
  Articles.find()
  .select('username title category createdAt _id')
  .then( articles => {
    if (articles) {
      const articlesByWriter = articles.filter(article => {
        return article.username === username
      })
      res.status(200).json({
        articlesByWriter: articlesByWriter.map( art => {
          return {
            article: art,
            request : {
              type: 'GET',
              url: `http://localhost:6000/article/${art._id}`
            }
          }
        })
      })
    } else {
      res.status(404).json({
        message: 'No article found'
      })
    }
  })
  .catch( err => {
    res.status(500).json({
      message: 'An error occured, please try again'
    })
  })
})

module.exports = app
