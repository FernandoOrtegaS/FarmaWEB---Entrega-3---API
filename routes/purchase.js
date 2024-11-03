import express from 'express';
import sql from '../db/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const resultado_precio_total = await sql(`
      SELECT SUM(producto.precio) AS total_precio
      FROM carrito
      JOIN producto ON carrito.id_producto = producto.id
      WHERE carrito.id_usuario = $1
    `, [id_usuario]);
    const total_precio = resultado_precio_total[0].total_precio || 0;

    const resultado_dinero_usuario = await sql('SELECT dinero FROM usuario WHERE id = $1', [id_usuario]);
    const dinero_actual = resultado_dinero_usuario[0].dinero || 0;

    if (dinero_actual < total_precio) {
      return res.status(400).json({ message: 'No tienes suficiente dinero' });
    }

    await sql('UPDATE usuario SET dinero = dinero - $1 WHERE id = $2', [total_precio, id_usuario]);
    await sql('INSERT INTO ventas (id_usuario, cantidad, fecha) VALUES ($1, $2, CURRENT_TIMESTAMP)', [id_usuario, total_precio]);
    await sql('DELETE FROM carrito WHERE id_usuario = $1', [id_usuario]);

    res.json({ message: 'compra ya realizada' });
  } catch (error) {
    console.error('error al hacer la compra:', error);
    res.status(500).json({ message: 'error al hacer la compra' });
  }
});

export default router;
