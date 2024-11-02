import express from 'express';
import sql from '../db/neon.js';
import { authMiddleware, isAdminMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/productos', async (req, res) => {
  const lista = await sql('SELECT * FROM producto');
  res.render('product', { lista });
});

router.get('/agregar/producto', authMiddleware, (req, res) => {
  res.render('agregar_producto');
});

router.post('/agregar', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { nombre, precio, imagen } = req.body;
  const query = 'INSERT INTO producto(nombre, precio, imagen) VALUES ($1, $2, $3)';
  await sql(query, [nombre, precio, imagen]);
  res.redirect('/');
});

router.get('/editar/producto/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { id } = req.params;
  const results = await sql('SELECT * FROM producto WHERE id = $1', [id]);
  res.render('editar_producto', results[0]);
});

router.post('/editar/producto/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, imagen } = req.body;
  await sql('UPDATE producto SET nombre = $1, precio = $2, imagen = $3 WHERE id = $4', [nombre, precio, imagen, id]);
  res.redirect('/admin');
});

router.post('/eliminar/producto/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await sql('DELETE FROM producto WHERE id = $1', [id]);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).send('Error eliminando el producto');
  }
});

export default router;

