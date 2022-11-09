const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// const pg = require('pg');
// const Pool = pg.Pool;
// const pool = new Pool({
//     database: 'music_library', // name of DB this can change
//     host: 'localhost', // where is your DB (localhost in this case)
//     port: 5432, // default for Postgres
//     max: 10, // max queries at one time
//     idleTimeoutMillis: 30000 // 30 seconds to try and connect otherwise cancel query
// });

// pool.on('connect', () => {
//     console.log('PostgresSQL is connected! Shout out Node!');
// });

// pool.on('error', (error) => {
//     console.log('Error with Postgres pool', error);
// });

// let songs = [
//     {
//         rank: 355, 
//         artist: 'Ke$ha', 
//         track: 'Tik-Toc', 
//         published: '1/1/2009'
//     },
//     {
//         rank: 356, 
//         artist: 'Gene Autry', 
//         track: 'Rudolph, the Red-Nosed Reindeer', 
//         published: '1/1/1949'
//     },
//     {
//         rank: 357, 
//         artist: 'Oasis', 
//         track: 'Wonderwall', 
//         published: '1/1/1996'
//     }
// ];

router.get('/', (req, res) => {
    // res.send(songs);  send only 1 thing as a response
    let queryText = 'SELECT * FROM "songs" ORDER BY "rank" DESC;';
    pool.query(queryText).then((result) => {
        console.log('result.rows', result.rows);
        res.send(result.rows)
    }).catch((error) => {
        console.log(`Error making query: ${queryText}, error: ${error}`);
        res.sendStatus(500);
    });
});

router.get('/:artist', (req, res) => {
    // res.send(songs);  send only 1 thing as a response
    const artist = req.params.artist;
    let queryText = `
        SELECT * FROM "songs" 
        WHERE "artist" LIKE $1
        ORDER BY "rank" DESC;`;
    pool.query(queryText, ['%' + artist + '%'])
        .then((result) => {
            console.log('result.rows', result.rows);
            res.send(result.rows)
        }).catch((error) => {
            console.log(`Error making query: ${queryText}, error: ${error}`);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    // // songs.push(req.body);
    // res.sendStatus(200);
    const newSong = req.body;
    // parameterized query with bling numbers
    const queryText = `
        INSERT INTO "songs" ("artist", "track", "published", "rank")
        VALUES ($1, $2, $3, $4);
    `;
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank])
        .then((result) => {
            console.log('POST result from DB', result);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log('Error POSTing query: ', queryText, 'error', error);
            res.sendStatus(500);
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log('delete request for id: ', id);
    const queryText = `DELETE FROM "songs" WHERE "id" = $1;`;
    pool.query(queryText, [id])
        .then(() => {
            console.log('Song Deleted');
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(`Error DELETEing with query: ${queryText}, error: ${error}`);
            res.sendStatus(500);
        });
});

module.exports = router;