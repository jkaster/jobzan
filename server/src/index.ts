import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Pool, types } from 'pg';

// Parse NUMERIC (OID 1700) as float
types.setTypeParser(types.builtins.NUMERIC, parseFloat);
import createJobsRouter from './routes/jobs';
import createEmployersRouter from './routes/employers';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json()); // for parsing application/json

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  if (!client) {
    return console.error('Client is undefined after acquiring');
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL database:', result.rows[0].now);
  });
});

// Pass the pool to the routers
app.use('/api/jobs', createJobsRouter(pool));
app.use('/api/employers', createEmployersRouter(pool));

// Basic route
app.get('/', (req, res) => {
  res.send('Jobzan Backend API is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});