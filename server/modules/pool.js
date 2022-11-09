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

module.exports = pool;