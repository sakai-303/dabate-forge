import { config } from 'dotenv';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { User, Topic, AnticipatedQuestion, NewPerspective, Conversation } from './entity';

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

// User リポジトリ関数
export const createUser = async (user: Omit<User, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO users (id, name) VALUES (?, ?)',
      [user.id, user.name]
    );
  } finally {
    connection.release();
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(User & RowDataPacket)[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
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

export const updateUser = async (id: string, user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    if (user.name !== undefined) {
      await connection.execute(
        'UPDATE users SET name = ? WHERE id = ?',
        [user.name, id]
      );
    }
  } finally {
    connection.release();
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
  } finally {
    connection.release();
  }
};

// Topic リポジトリ関数 (旧Agenda)
export const createTopic = async (topic: Omit<Topic, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO topics (id, user_id, title, stance) VALUES (?, ?, ?, ?)',
      [topic.id, topic.user_id, topic.title, topic.stance]
    );
  } finally {
    connection.release();
  }
};

export const getTopicById = async (id: string): Promise<Topic | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Topic & RowDataPacket)[]>(
      'SELECT * FROM topics WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

export const getTopics = async (): Promise<Topic[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Topic & RowDataPacket)[]>(
      'SELECT * FROM topics'
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const getTopicsByUserId = async (userId: string): Promise<Topic[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Topic & RowDataPacket)[]>(
      'SELECT * FROM topics WHERE user_id = ?',
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const updateTopic = async (id: string, topic: Partial<Omit<Topic, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const updateFields = [];
    const updateValues = [];
    
    if (topic.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(topic.title);
    }
    
    if (topic.stance !== undefined) {
      updateFields.push('stance = ?');
      updateValues.push(topic.stance);
    }
    
    if (topic.user_id !== undefined) {
      updateFields.push('user_id = ?');
      updateValues.push(topic.user_id);
    }
    
    if (updateFields.length === 0) {
      return; // Nothing to update
    }
    
    updateValues.push(id); // For the WHERE clause
    
    await connection.execute(
      `UPDATE topics SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues]
    );
  } finally {
    connection.release();
  }
};

export const deleteTopic = async (id: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM topics WHERE id = ?',
      [id]
    );
  } finally {
    connection.release();
  }
};

// AnticipatedQuestion リポジトリ関数 (旧Knowledge)
export const createAnticipatedQuestion = async (question: Omit<AnticipatedQuestion, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO anticipated_questions (id, topic_id, question, response) VALUES (?, ?, ?, ?)',
      [question.id, question.topic_id, question.question, question.response]
    );
  } finally {
    connection.release();
  }
};

export const getAnticipatedQuestionById = async (id: string): Promise<AnticipatedQuestion | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(AnticipatedQuestion & RowDataPacket)[]>(
      'SELECT * FROM anticipated_questions WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

export const getAnticipatedQuestionsByTopicId = async (topicId: string): Promise<AnticipatedQuestion[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(AnticipatedQuestion & RowDataPacket)[]>(
      'SELECT * FROM anticipated_questions WHERE topic_id = ?',
      [topicId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const updateAnticipatedQuestion = async (id: string, question: Partial<Omit<AnticipatedQuestion, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const updateFields = [];
    const updateValues = [];
    
    if (question.question !== undefined) {
      updateFields.push('question = ?');
      updateValues.push(question.question);
    }
    
    if (question.response !== undefined) {
      updateFields.push('response = ?');
      updateValues.push(question.response);
    }
    
    if (question.topic_id !== undefined) {
      updateFields.push('topic_id = ?');
      updateValues.push(question.topic_id);
    }
    
    if (updateFields.length === 0) {
      return; // Nothing to update
    }
    
    updateValues.push(id); // For the WHERE clause
    
    await connection.execute(
      `UPDATE anticipated_questions SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues]
    );
  } finally {
    connection.release();
  }
};

export const deleteAnticipatedQuestion = async (id: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM anticipated_questions WHERE id = ?',
      [id]
    );
  } finally {
    connection.release();
  }
};

// NewPerspective リポジトリ関数 (旧Curiosity)
export const createNewPerspective = async (perspective: Omit<NewPerspective, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO new_perspectives (id, topic_id, question, context, ai_response, status) VALUES (?, ?, ?, ?, ?, ?)',
      [perspective.id, perspective.topic_id, perspective.question, perspective.context, perspective.ai_response, perspective.status]
    );
  } finally {
    connection.release();
  }
};

export const getNewPerspectiveById = async (id: string): Promise<NewPerspective | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(NewPerspective & RowDataPacket)[]>(
      'SELECT * FROM new_perspectives WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

export const getNewPerspectivesByTopicId = async (topicId: string): Promise<NewPerspective[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(NewPerspective & RowDataPacket)[]>(
      'SELECT * FROM new_perspectives WHERE topic_id = ?',
      [topicId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const getPendingNewPerspectives = async (): Promise<NewPerspective[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(NewPerspective & RowDataPacket)[]>(
      "SELECT * FROM new_perspectives WHERE status = 'pending'"
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const updateNewPerspective = async (id: string, perspective: Partial<Omit<NewPerspective, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const updateFields = [];
    const updateValues = [];
    
    if (perspective.question !== undefined) {
      updateFields.push('question = ?');
      updateValues.push(perspective.question);
    }
    
    if (perspective.context !== undefined) {
      updateFields.push('context = ?');
      updateValues.push(perspective.context);
    }
    
    if (perspective.ai_response !== undefined) {
      updateFields.push('ai_response = ?');
      updateValues.push(perspective.ai_response);
    }
    
    if (perspective.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(perspective.status);
    }
    
    if (perspective.topic_id !== undefined) {
      updateFields.push('topic_id = ?');
      updateValues.push(perspective.topic_id);
    }
    
    if (updateFields.length === 0) {
      return; // Nothing to update
    }
    
    updateValues.push(id); // For the WHERE clause
    
    await connection.execute(
      `UPDATE new_perspectives SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues]
    );
  } finally {
    connection.release();
  }
};

export const deleteNewPerspective = async (id: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM new_perspectives WHERE id = ?',
      [id]
    );
  } finally {
    connection.release();
  }
};

// Conversation リポジトリ関数 (新規)
export const createConversation = async (conversation: Omit<Conversation, 'created_at' | 'updated_at'>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO conversations (id, topic_id, participant, summary, message_count) VALUES (?, ?, ?, ?, ?)',
      [conversation.id, conversation.topic_id, conversation.participant, conversation.summary, conversation.message_count]
    );
  } finally {
    connection.release();
  }
};

export const getConversationById = async (id: string): Promise<Conversation | null> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Conversation & RowDataPacket)[]>(
      'SELECT * FROM conversations WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};

export const getConversationsByTopicId = async (topicId: string): Promise<Conversation[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Conversation & RowDataPacket)[]>(
      'SELECT * FROM conversations WHERE topic_id = ?',
      [topicId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const getConversations = async (): Promise<Conversation[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<(Conversation & RowDataPacket)[]>(
      'SELECT * FROM conversations'
    );
    return rows;
  } finally {
    connection.release();
  }
};

export const updateConversation = async (id: string, conversation: Partial<Omit<Conversation, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const updateFields = [];
    const updateValues = [];
    
    if (conversation.participant !== undefined) {
      updateFields.push('participant = ?');
      updateValues.push(conversation.participant);
    }
    
    if (conversation.summary !== undefined) {
      updateFields.push('summary = ?');
      updateValues.push(conversation.summary);
    }
    
    if (conversation.message_count !== undefined) {
      updateFields.push('message_count = ?');
      updateValues.push(conversation.message_count);
    }
    
    if (conversation.topic_id !== undefined) {
      updateFields.push('topic_id = ?');
      updateValues.push(conversation.topic_id);
    }
    
    if (updateFields.length === 0) {
      return; // Nothing to update
    }
    
    updateValues.push(id); // For the WHERE clause
    
    await connection.execute(
      `UPDATE conversations SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues]
    );
  } finally {
    connection.release();
  }
};

export const deleteConversation = async (id: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'DELETE FROM conversations WHERE id = ?',
      [id]
    );
  } finally {
    connection.release();
  }
};

// クリーンアップ処理
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
