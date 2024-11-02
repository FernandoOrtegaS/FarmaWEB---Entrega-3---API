import express from 'express';
import sql from '../db/neon.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/carrito/agregar/:id', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const id_producto = req.params.id;
  await sql('INSERT INTO carrito(id_usuario, id_producto) VALUES ($1, $2)', [id_usuario, id_producto]);
  res.redirect('/');
});

router.get('/carrito', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const result = await sql('SELECT dinero FROM usuario WHERE id = $1', [id_usuario]);
  const dinero = result[0].dinero || 0;

  const productos = await sql(`
    SELECT producto.id, producto.imagen, producto.nombre, producto.precio 
    FROM carrito 
    JOIN producto ON carrito.id_producto = producto.id 
    WHERE carrito.id_usuario = $1
  `, [id_usuario]);

  const total_precio = await sql(`
    SELECT SUM(producto.precio) AS total_precio 
    FROM carrito 
    JOIN producto ON carrito.id_producto = producto.id 
    WHERE carrito.id_usuario = $1
  `, [id_usuario]);

  const es_vacio = productos.length === 0;
  res.render('carrito', { productos, total_precio: total_precio[0].total_precio || 0, es_vacio, dinero });
});

router.post('/carrito/eliminar/:id', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const id_producto = req.params.id;
  await sql('DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2', [id_usuario, id_producto]);
  res.redirect('/carrito');
});

export default router;
