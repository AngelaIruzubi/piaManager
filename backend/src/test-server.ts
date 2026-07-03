import express from 'express';

const app = express();
app.use(express.json());

app.post('/test', (req, res) => {
  res.json({ mensaje: 'funciona' });
});

app.listen(3001, () => {
  console.log('Test server en http://localhost:3001');
});

process.stdin.resume();