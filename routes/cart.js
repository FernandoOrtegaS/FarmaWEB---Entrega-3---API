import express from 'express';
import sql from '../db/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Muestra los productos en el carrito
router.get('/', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const result = await sql('SELECT dinero FROM usuario WHERE id = $1', [id_usuario]);
  const money = result[0].dinero || 0;
  const numero_productos = await sql('SELECT COUNT(id_usuario) AS total_productos FROM carrito WHERE id_usuario = $1', [id_usuario]);
  const numero_result = numero_productos[0].total_productos;
  const producto = await sql(`
    SELECT producto.id, producto.imagen, producto.nombre, producto.precio 
    FROM carrito 
    JOIN producto ON carrito.id_producto = producto.id 
    WHERE carrito.id_usuario = $1
  `, [id_usuario]);
  const resultado_precio_total = await sql(`
    SELECT SUM(producto.precio) AS total_precio 
    FROM carrito 
    JOIN producto ON carrito.id_producto = producto.id 
    WHERE carrito.id_usuario = $1
  `, [id_usuario]);
  const total_precio = resultado_precio_total[0].total_precio || 0;
  const es_vacio = numero_result === 0;
  res.json({ numero_result, producto, total_precio, es_vacio, money });
});

// Agrega un producto al carrito
router.post('/agregar/:productId', authMiddleware, async (req, res) => {
  const id_user = req.usuario.id;
  const id_producto = req.params.productId;

  await sql('INSERT INTO carrito(id_usuario, id_producto) VALUES ($1, $2)', [id_user, id_producto]);
  res.json({ message: 'Producto agregado al carrito' });
});

// Elimina un producto del carrito
router.delete('/eliminar/:productId', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const id_producto = req.params.productId;

  await sql('DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2', [id_usuario, id_producto]);
  res.json({ message: 'Producto eliminado del carrito' });
});

export default router;
