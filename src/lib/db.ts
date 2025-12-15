
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '193.203.175.194',
  user: 'u969185416_funcionario',
  database: 'u969185416_formulario',
  password: 'Grupopw2025',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
