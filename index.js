const express = require('express');
const { resolve } = require('path');
const { cors } = require('cors');
const { getAllMovies, getMovieById } = require('./Controllers/index');
const app = express();
const port = 3010;

app.use(express.static('static'));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Movies API' });
});

app.get('/movies', (req, res) => {
  let movies = getAllMovies();
  res.json({ movies });
});

app.get('/movies/details/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let movie = getMovieById(id);
  res.json({ movie });
});

module.exports = { app };
