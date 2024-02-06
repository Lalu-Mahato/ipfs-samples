const express = require('express');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'http://localhost:9200',
    logger: 'trace',
});

const data = require('../users.json');

// create index
router.use((req, res, next) => {
    client.index({
        index: 'logs',
        body: {
            url: req.url,
            method: req.method,
        }
    })
        .then(res => {
            console.log('Logs indexd')
        })
        .catch(err => {
            console.log(err);
        })
    next();
});

const bodyParser = require('body-parser')


// create users indexe
router.post('/users', async (req, res) => {
    client.index({
        index: 'users',
        body: req.body,
    })
        .then(res => {
            console.log('Logs indexd')
        })
        .catch(err => {
            console.log(err);
        })
});


// views indexes
router.get('/logs', async (req, res) => {
    try {
        const { body } = await client.search({
            index: 'logs',
            body: {
                query: {
                    match_all: {}
                },
            },
        });

        return res.send(body.hits.hits);
    } catch (error) {
        console.error('Error:', error);
    }
});

router.get('/', async (req, res) => {
    return res.send({ message: 'Hello World' });
});

module.exports = router;
