import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from '../src/lib/db'; // Ajuste o caminho conforme sua estrutura

const app = express();
const port = 3001; // Porta para a API

app.use(cors());
app.use(express.json());

// Endpoint para verificar se o CPF já existe
app.get('/employees/check-cpf/:cpf', async (req, res) => {
  const { cpf } = req.params;
  // Garante que estamos comparando apenas os números
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

// Endpoint para criar um novo funcionário
app.post('/employees', async (req, res) => {
  const employee = req.body;
  // O ID será gerado automaticamente pelo banco de dados.
  // Removemos o campo ID do objeto para evitar conflitos.
  delete employee.id; 
  
  const query = 'INSERT INTO employees SET ?';
  
  try {
    const [result] = await pool.query(query, employee);
    // A biblioteca mysql2 retorna um objeto com a propriedade insertId
    const insertId = (result as any).insertId;
    res.status(201).send({ message: 'Funcionário cadastrado com sucesso!', employeeId: insertId });
  } catch (error) {
    console.error('Erro ao salvar funcionário:', error);
    res.status(500).send({ message: 'Erro no servidor ao salvar funcionário.', error });
  }
});

// Endpoint para listar todos os funcionários
app.get('/employees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        res.status(500).send({ message: 'Erro no servidor ao buscar funcionários.', error });
    }
});


app.listen(port, () => {
  console.log(`API Server is running on http://localhost:${port}`);
});
