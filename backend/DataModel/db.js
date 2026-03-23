import env from 'dotenv';
import pgPromise from 'pg-promise';

env.config();
const pgp = pgPromise();
const db = pgp({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
})


export default db;