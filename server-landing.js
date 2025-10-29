const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static('.'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Tiva Landing ejecutándose en http://localhost:${PORT}`);
    console.log(`📄 Página principal: http://localhost:${PORT}`);
    console.log(`🛍️ Tiva Store: http://localhost:5175`);
    console.log(`🔧 API Backend: http://localhost:3001`);
});
