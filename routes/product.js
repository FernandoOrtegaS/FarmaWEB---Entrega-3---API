import express from 'express';
import sql from '../db/db.js';
import { authMiddleware, isAdminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Lista todos los productos
router.get('/', async (req, res) => {
  const lista = await sql('SELECT * FROM producto');
  res.json(lista);
});

// Obtiene información de un producto específico
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const producto = await sql('SELECT * FROM producto WHERE id = $1', [id]);
  
  if (producto.length > 0) {
    res.json(producto[0]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Agrega un nuevo producto (solo administrador)
router.post('/', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { nombre, precio, imagen } = req.body;
  await sql('INSERT INTO producto(nombre, precio, imagen) VALUES ($1, $2, $3)', [nombre, precio, imagen]);
  res.json({ message: 'Producto agregado exitosamente' });
});

// Modifica un producto existente (solo administrador)
router.put('/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const id = req.params.id;
  const { nombre, precio, imagen } = req.body;
  await sql('UPDATE producto SET nombre = $1, precio = $2, imagen = $3 WHERE id = $4', [nombre, precio, imagen, id]);
  res.json({ message: 'Producto modificado exitosamente' });
});

// Elimina un producto (solo administrador)
router.delete('/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const id = req.params.id;
  await sql('DELETE FROM producto WHERE id = $1', [id]);
  res.json({ message: 'Producto eliminado exitosamente' });
});

export default router;


