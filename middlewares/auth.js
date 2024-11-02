import jwt from 'jsonwebtoken';
import sql from '../db/neon.js';


const keyword = 'buenas';
const cookieNameAuth = "777";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies[cookieNameAuth];
  if (!token) return res.render('no_autorizados');
  try {
    req.usuario = jwt.verify(token, keyword);
    next();
  } catch {
    res.render('no_autorizados');
  }
};

export const isAdminMiddleware = async (req, res, next) => {
  const id = req.usuario.id;
  const results = await sql('SELECT * FROM usuario WHERE id = $1', [id]);
  const is_admin = results[0]?.rol;
  if (is_admin === 0) {
    return res.send('No eres admin');
  }
  next();
};
