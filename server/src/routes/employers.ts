import { Router, Request, Response, NextFunction } from 'express';
import { Pool, QueryResult } from 'pg';

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createEmployersRouter = (pool: Pool) => {
  const router = Router();

  // Get all employers
  router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result: QueryResult = await pool.query('SELECT id, name, latitude, longitude, contact_name AS "contactName", contact_phone AS "contactPhone", contact_email AS "contactEmail", website FROM employers');
    res.json(result.rows);
  }));

  // Get a single employer by ID
  router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result: QueryResult = await pool.query('SELECT id, name, latitude, longitude, contact_name AS "contactName", contact_phone AS "contactPhone", contact_email AS "contactEmail", website FROM employers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Employer not found');
    }
    res.json(result.rows[0]);
  }));

  // Create a new employer
  router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const { name, latitude, longitude, contactName, contactPhone, contactEmail, website } = req.body;
    const result: QueryResult = await pool.query(
      'INSERT INTO employers (id, name, latitude, longitude, contact_name, contact_phone, contact_email, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [generateId(), name, latitude, longitude, contactName, contactPhone, contactEmail, website]
    );
    res.status(201).json(result.rows[0]);
  }));

  // Update an employer
  router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, latitude, longitude, contactName, contactPhone, contactEmail, website } = req.body;
    const result: QueryResult = await pool.query(
      'UPDATE employers SET name = $1, latitude = $2, longitude = $3, contact_name = $4, contact_phone = $5, contact_email = $6, website = $7 WHERE id = $8 RETURNING *',
      [name, latitude, longitude, contactName, contactPhone, contactEmail, website, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Employer not found');
    }
    res.json(result.rows[0]);
  }));

  // Delete an employer
  router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result: QueryResult = await pool.query('DELETE FROM employers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Employer not found');
    }
    res.status(204).send(); // No Content
  }));

  return router;
};

export default createEmployersRouter;