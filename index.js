import express from 'express';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import purchaseRoutes from './routes/purchase.js';
import userRoutes from './routes/user.js';

const app = express();

// Middleware para manejar JSON, formularios y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuración de handlebars como motor de vistas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Rutas de la API
app.use('/auth', authRoutes);              // Rutas de autenticación
app.use('/admin', adminRoutes);             // Rutas de administrador
app.use('/products', productRoutes);        // Rutas de productos
app.use('/shoppingcart', cartRoutes);       // Rutas de carrito de compras
app.use('/purchase', purchaseRoutes);       // Rutas de compras
app.use('/user', userRoutes);               

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
