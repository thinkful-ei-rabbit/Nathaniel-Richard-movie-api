require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(function validateToken(req, res, next) {
  let auth = req.get('Authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) {
    res.status(401).send({ message: 'token not bearer' });
  }
  auth = auth.split(' ')[1];
  if (auth !== process.env.API_TOKEN) {
    res.status(401).send({ message: 'invalid token provided' });
  }
  next();
});

function handleQuery(req, res) {
  const { genre, country, avg_vote } = req.query;
  let results = [...movies];
  if (genre) {
    results = results.filter((x) => {
      return x.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }
  if (country) {
    results = results.filter((x) => {
      return x.country.toLowerCase().includes(country.toLowerCase());
    });
  }
  if (avg_vote) {
    results = results.filter((x) => {
      return x.avg_vote >= parseFloat(avg_vote);
    });
  }
  if (results.length === 0) {
    res.send('No results that match search parameters.');
  }
  res.send(results);
}

app.get('/movie', handleQuery);

const PORT = 8000;

app.listen(PORT, () => {
  console.log('server listening at 8000');
});
