import { Pool } from 'pg';
import { config } from 'dotenv';
import { mockEmployers, mockJobs } from 'jobtypes';

config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

/**
 * Populates the PostgreSQL database with mock employer and job data.
 * Can optionally wipe existing data before insertion.
 */
async function populateDb() {
  const args = process.argv.slice(2);
  const wipeData = args.includes('-w') || args.includes('--wipe');

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    if (wipeData) {
      console.log('Wiping existing data...');
      await client.query('DELETE FROM jobs');
      await client.query('DELETE FROM employers');
      console.log('Data wiped.');
    }

    for (const employer of mockEmployers) {
      await client.query(
        'INSERT INTO employers (id, name, latitude, longitude, contact_name, contact_phone, contact_email, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
        [
          employer.id,
          employer.name,
          employer.latitude,
          employer.longitude,
          employer.contactName,
          employer.contactPhone,
          employer.contactEmail,
          employer.website,
        ],
      );
    }
    console.log(
      `Attempted to insert ${mockEmployers.length} employers (existing IDs skipped).`,
    );

    for (const job of mockJobs) {
      await client.query(
        'INSERT INTO jobs (id, employer_id, title, salary, status, commute, description, notes, job_description_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
        [
          job.id,
          job.employerId,
          job.title,
          job.salary,
          job.status,
          job.commute,
          job.description,
          job.notes,
          job.jobDescriptionLink,
        ],
      );
    }
    console.log(
      `Attempted to insert ${mockJobs.length} jobs (existing IDs skipped).`,
    );

    await client.query('COMMIT');
    console.log('Database populated successfully!');
  } catch (e) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Error populating database:', e);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

populateDb();
