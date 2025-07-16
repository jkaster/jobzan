import { Router, Request, Response, NextFunction } from "express";
import { Pool, QueryResult } from "pg";
import { IEmployer } from "../../packages/jobtypes/src/IEmployer";

/**
 * Helper function to generate a random UUID-like string (for new employers).
 * @returns {string} A unique ID string.
 */
const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

/**
 * Wraps an Express async route handler to catch errors and pass them to the next middleware.
 * @param fn The async function to wrap.
 * @returns An Express route handler.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Creates an Express router for employer-related API endpoints.
 * @param pool The PostgreSQL connection pool.
 * @returns The configured Express router.
 */
const createEmployersRouter = (pool: Pool) => {
  const router = Router();

  /**
   * GET /api/employers
   * Retrieves all employers from the database.
   */
  router.get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
      const result: QueryResult = await pool.query(
        'SELECT id, name, latitude, longitude, contact_name AS "contactName", contact_phone AS "contactPhone", contact_email AS "contactEmail", website FROM employers',
      );
      res.json(result.rows);
    }),
  );

  /**
   * GET /api/employers/:id
   * Retrieves a single employer by their ID.
   * @param {string} req.params.id - The ID of the employer to retrieve.
   */
  router.get(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result: QueryResult = await pool.query(
        'SELECT id, name, latitude, longitude, contact_name AS "contactName", contact_phone AS "contactPhone", contact_email AS "contactEmail", website FROM employers WHERE id = $1',
        [id],
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Employer not found");
      }
      res.json(result.rows[0]);
    }),
  );

  /**
   * POST /api/employers
   * Creates a new employer in the database.
   * @param {IEmployer} req.body - The employer object to create.
   */
  router.post(
    "/",
    asyncHandler(async (req: Request<{}, {}, IEmployer>, res: Response) => {
      const {
        name,
        latitude,
        longitude,
        contactName,
        contactPhone,
        contactEmail,
        website,
      } = req.body;
      const result: QueryResult = await pool.query(
        "INSERT INTO employers (id, name, latitude, longitude, contact_name, contact_phone, contact_email, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          generateId(),
          name,
          latitude,
          longitude,
          contactName,
          contactPhone,
          contactEmail,
          website,
        ],
      );
      res.status(201).json(result.rows[0]);
    }),
  );

  /**
   * PUT /api/employers/:id
   * Updates an existing employer in the database.
   * @param {string} req.params.id - The ID of the employer to update.
   * @param {IEmployer} req.body - The employer object with updated data.
   */
  router.put(
    "/:id",
    asyncHandler(async (req: Request<{ id: string }, {}, IEmployer>, res: Response) => {
      const { id } = req.params;
      const {
        name,
        latitude,
        longitude,
        contactName,
        contactPhone,
        contactEmail,
        website,
      } = req.body;
      const result: QueryResult = await pool.query(
        "UPDATE employers SET name = $1, latitude = $2, longitude = $3, contact_name = $4, contact_phone = $5, contact_email = $6, website = $7 WHERE id = $8 RETURNING *",
        [
          name,
          latitude,
          longitude,
          contactName,
          contactPhone,
          contactEmail,
          website,
          id,
        ],
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Employer not found");
      }
      res.json(result.rows[0]);
    }),
  );

  /**
   * DELETE /api/employers/:id
   * Deletes an employer from the database.
   * @param req.params.id - The ID of the employer to delete.
   */
  router.delete(
    "/:id",
    asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const result: QueryResult = await pool.query(
        "DELETE FROM employers WHERE id = $1 RETURNING *",
        [id],
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Employer not found");
      }
      res.status(204).send(); // No Content
    }),
  );

  return router;
};

export default createEmployersRouter;