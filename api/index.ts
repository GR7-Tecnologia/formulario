import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './lib/db.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 1. Criar um roteador para a API
const apiRouter = express.Router();

// 2. Definir todas as rotas no roteador, SEM o prefixo /api
apiRouter.get('/employees/check-cpf/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const cleanedCpf = cpf.replace(/[.\-]/g, '');
  const query = 'SELECT id FROM employees WHERE cpf = ?';
  try {
    const [rows] = await pool.query(query, [cleanedCpf]);
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    res.status(500).send({ message: 'Erro no servidor ao verificar CPF.', error });
  }
});

apiRouter.post('/employees', async (req, res) => {
  const employee = req.body;
  delete employee.id;
  const query = 'INSERT INTO employees SET ?';
  try {
    const [result] = await pool.query(query, employee);
    const insertId = (result as any).insertId;
    res.status(201).send({ message: 'Funcionário cadastrado com sucesso!', employeeId: insertId });
  } catch (error) {
    console.error('Erro ao salvar funcionário:', error);
    res.status(500).send({ message: 'Erro no servidor ao salvar funcionário.', error });
  }
});

apiRouter.get('/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).send({ message: 'Erro no servidor ao buscar funcionários.', error });
  }
});

// 3. Usar o roteador no aplicativo principal com o prefixo /api
// Qualquer chamada para /api/* será tratada pelo apiRouter
app.use('/api', apiRouter);

// Inicia o servidor apenas para desenvolvimento local. Vercel ignora isso.
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`API Server is running on http://localhost:${port}`);
  });
}

// Exporta o app para a Vercel
export default app;
