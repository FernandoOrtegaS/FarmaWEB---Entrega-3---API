import express from 'express';
import sql from '../db/db.js';
import { authMiddleware, isAdminMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.get('/totalEarned', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const result = await sql('SELECT SUM(cantidad) AS total_earned FROM ventas');
    const totalEarned = result[0].total_earned || 0;
    res.json({ totalEarned });
  } catch (error) {
    console.error('no se pudo obtener el total:', error);
    res.status(500).json({ message: 'no se pudo obtener el total' });
  }
});


router.post('/products', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { nombre, precio, imagen } = req.body;
  try {
    await sql('INSERT INTO producto(nombre, precio, imagen) VALUES ($1, $2, $3)', [nombre, precio, imagen]);
    res.json({ message: 'se agrego el producto' });
  } catch (error) {
    console.error('Error agregando producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});


router.put('/products/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const id = req.params.id;
  const { nombre, precio, imagen } = req.body;
  try {
    await sql('UPDATE producto SET nombre = $1, precio = $2, imagen = $3 WHERE id = $4', [nombre, precio, imagen, id]);
    res.json({ message: 'producto editado' });
  } catch (error) {
    console.error('Error modificando producto:', error);
    res.status(500).json({ message: 'error al editarlo ' });
  }
});


router.delete('/products/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    await sql('DELETE FROM producto WHERE id = $1', [id]);
    res.json({ message: 'se elimino el producto' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'no se pudo eliminar' });
  }
});

export default router;

