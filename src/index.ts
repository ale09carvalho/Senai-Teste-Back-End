import path from 'path';
import express from 'express';
import cors from 'cors';
import app from './app';

const server = express();
const PORT = Number(process.env.PORT) || 3000;

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(app);

server.listen(PORT, () => {
  console.log(`NutriVitta IMC API rodando em http://localhost:${PORT}`);
});
