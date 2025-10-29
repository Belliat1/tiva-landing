import express from 'express';

const app = express();
const PORT = 5001;

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando en puerto 5001' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de prueba funcionando en puerto ${PORT}`);
});
