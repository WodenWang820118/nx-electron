import { Router, Request, Response } from 'express';

const router = Router();

// GET /health - Health check endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Backend is up and running',
  });
});

export default router;
