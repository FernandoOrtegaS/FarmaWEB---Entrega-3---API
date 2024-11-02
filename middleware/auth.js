import jwt from 'jsonwebtoken';
import sql from '../db/db.js';

const keyword = 'ktal';
const cookieNameAuth = "jaja";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies[cookieNameAuth];
  if (!token) return res.render('no_autorizados');

  try {
    req.usuario = jwt.verify(token, keyword);
    next();
  } catch (e) {
    res.render('no_autorizados');
  }
};

export const isAdminMiddleware = async (req, res, next) => {
  const id = req.usuario.id;
  const results = await sql('select * from usuario where id = $1', [id]);
  const is_admin = results[0].rol;

  if (is_admin === 0) {
    return res.send('No eres admin');
  }
  next();
};

