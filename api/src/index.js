import express, { json, urlencoded } from 'express';
import productsRoutes from './routes/products/index.js';
import authRoutes from './routes/auth/index.js';
import ordersRoutes from './routes/orders/index.js';
import paypalRoutes from './routes/paypal/index.js';
//import stripeRoutes from './routes/stripe/index.js';

import serverless from 'serverless-http';

const port = 3001;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(
  json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get('/', (req, res) => {
  res.send('Hola !');
});

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/orders', ordersRoutes);
app.use('/paypal', paypalRoutes);
//app.use('/stripe', stripeRoutes);

if (process.env.NODE_ENV === 'dev') {
  app.listen(port, () => {
    console.log(`localhost:${port}/`);
  });
}

export const handler = serverless(app);
