const express = require('express');
const redis = require('redis');

const app = express();
const port = process.env.PORT || 3001;
const REDIS_URL = process.env.STORAGE_URL || 'redis://localhost:6379';

// Подключение к Redis
const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect()
})()

app.post('/counter/:id/incr', async (req, res) => {
  const bookId = req.params.id;
  try {
    await client.incr(bookId);
    res.send('Counter incremented');
  } catch (err) {
    console.error('Error incrementing counter:', err);
    res.status(500).send('Error incrementing counter');
  }
});

app.get('/counter/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const count = await client.get(bookId);
    res.json({ count: parseInt(count, 10) || 0 });
  } catch (err) {
    console.error('Error getting counter:', err);
    res.status(500).send('Error getting counter');
  }
});


app.listen(port, () => {
  console.log(`Counter service listening at http://localhost:${port}`);
});