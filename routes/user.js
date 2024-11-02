import express from 'express';
import sql from '../db/neon.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();
const keyword = 'buenas';
const cookieNameAuth = "777";

router.get('/registro', (req, res) => {
  res.render('registro');
});

router.post('/signup', async (req, res) => {
  const { nombre, mail, password } = req.body;
  const hash = bcrypt.hashSync(password, 5);
  const query = 'INSERT INTO usuario(nombre, mail, password) VALUES ($1, $2, $3) RETURNING id';

  try {
    const results = await sql(query, [nombre, mail, hash]);
    const id = results[0].id;
    const token = jwt.sign({ id, exp: Math.floor(Date.now() / 1000) + 45 * 60 }, keyword);
    res.cookie(cookieNameAuth, token, { maxAge: 45 * 60 * 1000 });
    res.redirect('/perfil');
  } catch {
    res.render('yaRegistrado');
  }
});

router.get('/perfil', authMiddleware, async (req, res) => {
  const id_usuario = req.usuario.id;
  const query = 'SELECT nombre, dinero, mail FROM usuario WHERE id = $1';
  const results = await sql(query, [id_usuario]);
  res.render('perfil', results[0]);
});

export default router;
