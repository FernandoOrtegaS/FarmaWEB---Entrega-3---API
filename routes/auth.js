import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '../db/neon.js';
import { authMiddleware, isAdminMiddleware } from '../middlewares/auth.js';

const router = express.Router();
const keyword = 'buenas';
const cookieNameAuth = "777";

router.get('/login', (req, res) => {
  const error = req.query.error;
  res.render('login', { error });
});

router.post('/login', async (req, res) => {
  const { mail, password } = req.body;
  const query = 'SELECT id, password FROM usuario WHERE mail = $1';
  const results = await sql(query, [mail]);

  if (results.length === 0) return res.redirect('/login?error=unauthorized');

  const id = results[0].id;
  const hash = results[0].password;

  if (bcrypt.compareSync(password, hash)) {
    const token = jwt.sign({ id, exp: Math.floor(Date.now() / 1000) + 5 * 60 }, keyword);
    res.cookie(cookieNameAuth, token, { maxAge: 5 * 60 * 1000, httpOnly: true });
    return res.redirect('/perfil');
  }

  res.redirect('/login?error=unauthorized');
});

router.post('/logout', (req, res) => {
  res.cookie(cookieNameAuth, '', { maxAge: 1 });
  res.redirect('/login');
});

export default router;
