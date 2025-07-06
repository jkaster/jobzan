import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Pool, types } from "pg";

// Parse NUMERIC (OID 1700) as float to ensure correct data types from PostgreSQL
types.setTypeParser(types.builtins.NUMERIC, parseFloat);

import createJobsRouter from "./routes/jobs";
import createEmployersRouter from "./routes/employers";

dotenv.config();

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();

/**
 * Port for the server to listen on. Defaults to 5000 if not specified in environment variables.
 * @type {number}
 */
const port = process.env.PORT || 5000;

// Middleware
/**
 * CORS middleware configuration. Allows requests from http://localhost:5173.
 */
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
/**
 * Middleware to parse incoming JSON requests.
 */
app.use(express.json()); // for parsing application/json

/**
 * PostgreSQL Connection Pool.
 * @type {Pool}
 */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

/**
 * Connects to the PostgreSQL database and logs the connection status.
 */
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  if (!client) {
    return console.error("Client is undefined after acquiring");
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to PostgreSQL database:", result.rows[0].now);
  });
});

// Pass the pool to the routers
/**
 * Mounts the jobs router at /api/jobs.
 */
app.use("/api/jobs", createJobsRouter(pool));
/**
 * Mounts the employers router at /api/employers.
 */
app.use("/api/employers", createEmployersRouter(pool));

/**
 * Basic root route to confirm the API is running.
 * @param req - Express request object.
 * @param res - Express response object.
 */
app.get("/", (req, res) => {
  res.send("Jobzan Backend API is running!");
});

/**
 * Starts the Express server and listens for incoming requests.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
