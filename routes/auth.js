import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '../db/db.js';

const router = express.Router();
const keyword = 'ktal';
const cookieNameAuth = "jaja";

router.get('/auth', (req, res) => {
  res.render('auth'); 
});

router.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  const query = 'SELECT id, password FROM usuario WHERE mail = $1';
  const results = await sql(query, [mail]);

  if (results.length === 0) {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }

  const id = results[0].id;
  const hash = results[0].password;

  if (bcrypt.compareSync(password, hash)) {
    const token = jwt.sign({ id }, keyword, { expiresIn: '5m' });
    res.cookie(cookieNameAuth, token, { maxAge: 5 * 60 * 1000, httpOnly: true });
    res.json({ message: 'se inició sesión' });
  } else {
    res.status(401).json({ message: 'usuario o contraseña incorrectos' });
  }
});


router.post('/signup', async (req, res) => {
  const { nombre, mail, password } = req.body;

  const hash = bcrypt.hashSync(password, 5);
  const query = 'INSERT INTO usuario(nombre, mail, password) VALUES ($1, $2, $3) RETURNING id';

  try {
    const results = await sql(query, [nombre, mail, hash]);
    const id = results[0].id;

    const token = jwt.sign({ id }, keyword, { expiresIn: '45m' });
    res.cookie(cookieNameAuth, token, { maxAge: 45 * 60 * 1000, httpOnly: true });
    res.json({ message: 'registro exitoso' });
  } catch {
    res.status(400).json({ message: 'el usuario ya está registrado' });
  }
});


router.post('/logout', (req, res) => {
  res.cookie(cookieNameAuth, '', { maxAge: 1 });
  res.json({ message: 'se cerró la sesión' });
});

export default router;

