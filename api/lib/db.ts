import mysql from 'mysql2/promise';

let pool;

try {
  console.log('Attempting to create database pool...');
  console.log('DB_HOST is:', process.env.DB_HOST ? 'Set' : 'NOT SET');
  console.log('DB_USER is:', process.env.DB_USER ? 'Set' : 'NOT SET');
  console.log('DB_DATABASE is:', process.env.DB_DATABASE ? 'Set' : 'NOT SET');

  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_DATABASE || !process.env.DB_PASSWORD) {
    throw new Error('Missing one or more required database environment variables.');
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10-second timeout
  });

  console.log('Database pool created. This does not guarantee a successful connection yet.');

} catch (error) {
  console.error('CRITICAL: Failed to create database pool on module load.', error);
  // Re-lançar o erro garante que a Vercel registre a falha da função.
  throw error;
}

export default pool;
