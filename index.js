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


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use('/auth', authRoutes);             
app.use('/admin', adminRoutes);             
app.use('/products', productRoutes);       
app.use('/shoppingcart', cartRoutes);       
app.use('/purchase', purchaseRoutes);       
app.use('/user', userRoutes);               


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
