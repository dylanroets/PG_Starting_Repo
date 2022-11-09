const express = require('express');
const router = express.Router();

const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    database: 'music_library', // name of DB this can change
    host: 'localhost', // where is your DB (localhost in this case)
    port: 5432, // default for Postgres
    max: 10, // max queries at one time
    idleTimeoutMillis: 30000 // 30 seconds to try and connect otherwise cancel query
});

pool.on('connect', () => {
    console.log('PostgresSQL is connected! Shout out Node!');
});

pool.on('error', (error) => {
    console.log('Error with Postgres pool', error);
});

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // res.send(songs);  send only 1 thing as a response
    let queryText = 'SELECT * FROM "songs";';
    pool.query(queryText).then((result) => {
        res.send(result.rows)
    }).catch((error) => {
        console.log(`Error making query: ${queryText}, error: ${error}`);
        res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
    songs.push(req.body);
    res.sendStatus(200);
});

module.exports = router;