const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3001';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://order-service:3000';

app.use('/api/products', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    let url = `${PRODUCT_SERVICE}/products`;
    if (req.url && req.url !== '/') url += req.url;
    const options = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.method !== 'GET') options.body = JSON.stringify(req.body);
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Product service unavailable' });
  }
});

app.use('/api/orders', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    let url = `${ORDER_SERVICE}/orders`;
    if (req.url && req.url !== '/') url += req.url;
    const options = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.method !== 'GET') options.body = JSON.stringify(req.body);
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Order service unavailable' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'store-admin' }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Store Admin running on port ${PORT}`));