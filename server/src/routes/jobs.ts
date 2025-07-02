import { Router, Request, Response, NextFunction } from 'express';
import { Pool, QueryResult } from 'pg';

/**
 * Helper function to generate a random UUID-like string (for new jobs).
 * @returns {string} A unique ID string.
 */
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

/**
 * Wraps an Express async route handler to catch errors and pass them to the next middleware.
 * @param fn The async function to wrap.
 * @returns An Express route handler.
 */
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Creates an Express router for job-related API endpoints.
 * @param pool The PostgreSQL connection pool.
 * @returns The configured Express router.
 */
const createJobsRouter = (pool: Pool) => {
  const router = Router();

  /**
   * GET /api/jobs
   * Retrieves all jobs from the database.
   */
  router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result: QueryResult = await pool.query('SELECT id, employer_id AS "employerId", title, salary, status, commute, description, notes, job_description_link AS "jobDescriptionLink" FROM jobs');
    res.json(result.rows);
  }));

  /**
   * GET /api/jobs/:id
   * Retrieves a single job by its ID.
   * @param {string} req.params.id - The ID of the job to retrieve.
   */
  router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result: QueryResult = await pool.query('SELECT id, employer_id AS "employerId", title, salary, status, commute, description, notes, job_description_link AS "jobDescriptionLink" FROM jobs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Job not found');
    }
    res.json(result.rows[0]);
  }));

  /**
   * POST /api/jobs
   * Creates a new job in the database.
   * @param {IJob} req.body - The job object to create.
   */
  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { employerId, title, salary, status, commute, description, notes, jobDescriptionLink } = req.body;
    const result: QueryResult = await pool.query(
      'INSERT INTO jobs (id, employer_id, title, salary, status, commute, description, notes, job_description_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [generateId(), employerId, title, salary, status, commute, description, notes, jobDescriptionLink]
    );
    res.status(201).json(result.rows[0]);
  }));

  /**
   * PUT /api/jobs/:id
   * Updates an existing job in the database.
   * @param {string} req.params.id - The ID of the job to update.
   * @param {IJob} req.body - The job object with updated data.
   */
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

  /**
   * DELETE /api/jobs/:id
   * Deletes a job from the database.
   * @param req.params.id - The ID of the job to delete.
   */
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