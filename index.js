import express from 'express';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';

import productRouter from './routes/product.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import cartRouter from './routes/cart.js';
import adminRouter from './routes/admin.js'; 

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', cartRouter);
app.use('/api', adminRouter); 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
