import { config } from 'dotenv';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { Curiosity, Knowledge, User } from './entity';

config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export const createUser = async (user: User): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO users (id) VALUES (?)',
      [user.id]
    );
  } finally {
    connection.release();
  }
};

export const getUsers = async (): Promise<User[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(User & RowDataPacket)[]>(
      'SELECT * FROM users'
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const createKnowledge = async (knowledge: Omit<Knowledge, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO knowledge (id, agenda_id, question, answer) VALUES (?, ?, ?, ?)',
      [knowledge.id, knowledge.agenda_id, knowledge.question, knowledge.answer]
    );
  } finally {
    connection.release();
  }
};

export const getKnowledgeByAgendaId = async (agendaId: string): Promise<Knowledge[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Knowledge & RowDataPacket)[]>(
      'SELECT * FROM knowledge WHERE agenda_id = ?',
      [agendaId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const createCuriosity = async (curiosity: Omit<Curiosity, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO curiosities (id, agenda_id, question) VALUES (?, ?, ?)',
      [curiosity.id, curiosity.agenda_id, curiosity.question]
    );
  } finally {
    connection.release();
  }
};

export const getCuriositiesByAgendaId = async (agendaId: string): Promise<Curiosity[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Curiosity & RowDataPacket)[]>(
      'SELECT * FROM curiosities WHERE agenda_id = ?',
      [agendaId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
