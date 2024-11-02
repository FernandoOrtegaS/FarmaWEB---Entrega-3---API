import express from 'express';
import sql from '../db/neon.js';
import { authMiddleware, isAdminMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin', authMiddleware, isAdminMiddleware, async (req, res) => {
  const ventas = await sql('SELECT * FROM ventas');
  const total_ventas = await sql('SELECT SUM(cantidad) FROM ventas');
  const productos = await sql('SELECT * FROM producto');
  res.render('admin', { ventas, total_ventas: total_ventas[0].sum || 0, productos });
});

export default router;
