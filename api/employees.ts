import pool from './lib/db.js';

// Vercel Serverless Function handler for /api/employees
// This file is used in production on Vercel.
// The existing Express app in index.ts is kept for local development.

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const employee = req.body;
    // Remove id if it comes from the client, since it's auto-increment in DB
    if (employee && 'id' in employee) {
      delete employee.id;
    }

    const query = 'INSERT INTO employees SET ?';

    try {
      const [result] = await pool.query(query, employee);
      const insertId = (result as any).insertId;
      return res
        .status(201)
        .json({ message: 'Funcionário cadastrado com sucesso!', employeeId: insertId });
    } catch (error: any) {
      console.error('Erro ao salvar funcionário (Vercel API):', error);
      // Mantém o mesmo formato de erro esperado pelo frontend
      return res
        .status(500)
        .json({ message: 'Erro no servidor ao salvar funcionário.', error });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM employees');
      return res.status(200).json(rows);
    } catch (error: any) {
      console.error('Erro ao buscar funcionários (Vercel API):', error);
      return res
        .status(500)
        .json({ message: 'Erro no servidor ao buscar funcionários.', error });
    }
  }

  // Método não permitido
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}


