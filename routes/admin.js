import express from 'express';
import sql from '../db/db.js';
import { authMiddleware, isAdminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtiene el total ganado por la tienda
router.get('/totalEarned', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const result = await sql('SELECT SUM(cantidad) AS total_earned FROM ventas');
    const totalEarned = result[0].total_earned || 0;
    res.json({ totalEarned });
  } catch (error) {
    console.error('Error obteniendo el total ganado:', error);
    res.status(500).json({ message: 'Error obteniendo el total ganado' });
  }
});

// Agrega un nuevo producto (solo administrador)
router.post('/products', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { nombre, precio, imagen } = req.body;
  try {
    await sql('INSERT INTO producto(nombre, precio, imagen) VALUES ($1, $2, $3)', [nombre, precio, imagen]);
    res.json({ message: 'Producto agregado exitosamente' });
  } catch (error) {
    console.error('Error agregando producto:', error);
    res.status(500).json({ message: 'Error agregando producto' });
  }
});

// Modifica un producto existente (solo administrador)
router.put('/products/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const id = req.params.id;
  const { nombre, precio, imagen } = req.body;
  try {
    await sql('UPDATE producto SET nombre = $1, precio = $2, imagen = $3 WHERE id = $4', [nombre, precio, imagen, id]);
    res.json({ message: 'Producto modificado exitosamente' });
  } catch (error) {
    console.error('Error modificando producto:', error);
    res.status(500).json({ message: 'Error modificando producto' });
  }
});

// Elimina un producto (solo administrador)
router.delete('/products/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    await sql('DELETE FROM producto WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

export default router;

