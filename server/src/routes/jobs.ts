import { Router, Request, Response, NextFunction } from 'express';
import { Pool, QueryResult } from 'pg';

// Helper function to generate a random UUID-like string (for new jobs)
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createJobsRouter = (pool: Pool) => {
  const router = Router();

  // Get all jobs
  router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result: QueryResult = await pool.query('SELECT id, employer_id AS "employerId", title, salary, status, commute, description, notes, job_description_link AS "jobDescriptionLink" FROM jobs');
    res.json(result.rows);
  }));

  // Get a single job by ID
  router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result: QueryResult = await pool.query('SELECT id, employer_id AS "employerId", title, salary, status, commute, description, notes, job_description_link AS "jobDescriptionLink" FROM jobs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Job not found');
    }
    res.json(result.rows[0]);
  }));

  // Create a new job
  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { employerId, title, salary, status, commute, description, notes, jobDescriptionLink } = req.body;
    const result: QueryResult = await pool.query(
      'INSERT INTO jobs (id, employer_id, title, salary, status, commute, description, notes, job_description_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [generateId(), employerId, title, salary, status, commute, description, notes, jobDescriptionLink]
    );
    res.status(201).json(result.rows[0]);
  }));

  // Update a job
  router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { employerId, title, salary, status, commute, description, notes, jobDescriptionLink } = req.body;
    const result: QueryResult = await pool.query(
      'UPDATE jobs SET employer_id = $1, title = $2, salary = $3, status = $4, commute = $5, description = $6, notes = $7, job_description_link = $8 WHERE id = $9 RETURNING *',
      [employerId, title, salary, status, commute, description, notes, jobDescriptionLink, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Job not found');
    }
    res.json(result.rows[0]);
  }));

  // Delete a job
  router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result: QueryResult = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Job not found');
    }
    res.status(204).send(); // No Content
  }));

  return router;
};

export default createJobsRouter;