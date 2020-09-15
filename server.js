require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const movies = require('./movies')

const app = express();

app.use(morgan('dev'));

app.use(function validateToken(req, res, next){
    let auth = req.get('Authorization') || ('');
    if(!auth.toLowerCase().startsWith('bearer ')) {
        res.status(401).send({message: 'token not bearer'})
    }
    auth = auth.split(' ')[1];
    if (auth !== process.env.API_TOKEN){
        res.status(401).send({message: 'invalid token provided'})
    }
    next()
});

function handleQuery(req, res) {
    const { genre, country, avg_vote } = req.query;
    let results = [...movies];
    if (genre) {
        results = results.filter((x) => {
            return x.genre.toLowerCase().includes(genre.toLowerCase())
        });
    }
    res.send(results);
}

app.get('/movie', handleQuery)

const PORT = 8000;

app.listen(PORT, () => {
    console.log('server listening at 8000')
})
