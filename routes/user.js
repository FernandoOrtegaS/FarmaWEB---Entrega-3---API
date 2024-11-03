import express from 'express';
import sql from '../db/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.get('/profile', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const query = 'SELECT nombre, dinero, mail FROM usuario WHERE id = $1';
  const results = await sql(query, [id_usuario]);
  
  if (results.length > 0) {
    res.json(results[0]);
  } else {
    res.status(404).json({ message: 'no se encontro el usuario' });
  }
});


router.post('/agregar/dinero', authMiddleware, async (req, res) => {
  const id = req.usuario.id;
  const dinero = parseFloat(req.body.dinero);
  const result = await sql('SELECT dinero FROM usuario WHERE id = $1', [id]);
  const dineroActual = parseFloat(result[0].dinero) || 0; 
  const nuevoSaldo = dinero + dineroActual;

  await sql('UPDATE usuario SET dinero = $1 WHERE id = $2', [nuevoSaldo, id]);
  res.json({ message: 'dinero agregado', nuevoSaldo });
});


router.get('/historial', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const query = `
    SELECT ventas.id, ventas.cantidad, ventas.fecha
    FROM ventas
    WHERE ventas.id_usuario = $1
  `;
  const results = await sql(query, [id_usuario]);

  results.forEach(venta => {
    venta.fecha = new Date(venta.fecha).toLocaleDateString();
  });

  res.json({ historial: results });
});

export default router;
