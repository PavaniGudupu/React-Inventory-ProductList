import env from 'dotenv';
import pgPromise from 'pg-promise';

env.config();

const pgp = pgPromise();

const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default db;