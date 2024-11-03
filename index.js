import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cartRoutes from './routes/cart.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import purchaseRoutes from './routes/purchase.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3010;


app.use(express.json());
app.use(cookieParser());


app.use('/cart', cartRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
