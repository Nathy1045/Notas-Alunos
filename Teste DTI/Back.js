// BACK-END (Node.js + Express + SQLite)
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './alunos.db',
    driver: sqlite3.Database
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    notas TEXT,
    frequencia INTEGER,
    media REAL
  )`);
})();

app.get('/alunos', async (req, res) => {
  const alunos = await db.all('SELECT * FROM alunos');
  alunos.forEach(a => a.notas = JSON.parse(a.notas));
  res.json(alunos);
});

app.post('/alunos', async (req, res) => {
  const { nome, notas, frequencia } = req.body;
  const media = notas.reduce((a, b) => a + b, 0) / notas.length;
  const result = await db.run(
    'INSERT INTO alunos (nome, notas, frequencia, media) VALUES (?, ?, ?, ?)',
    nome,
    JSON.stringify(notas),
    frequencia,
    media
  );
  res.status(201).json({ id: result.lastID, nome, notas, frequencia, media });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
