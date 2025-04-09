import { v4 as uuidv4 } from 'uuid';

// User エンティティ
export class User {
    id: string = uuidv4();
    name: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();
    
    constructor(name: string) {
        this.name = name;
    }
}

// Topic エンティティ (旧Agenda)
export class Topic {
    id: string = uuidv4();
    user_id: string;
    title: string;
    stance: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(user_id: string, title: string, stance: string) {
        this.user_id = user_id;
        this.title = title;
        this.stance = stance;
    }
}

// AnticipatedQuestion エンティティ (旧Knowledge)
export class AnticipatedQuestion {
    id: string = uuidv4();
    topic_id: string;
    question: string;
    response: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(topic_id: string, question: string, response: string) {
        this.topic_id = topic_id;
        this.question = question;
        this.response = response;
    }
}

// NewPerspective エンティティ (旧Curiosity)
export class NewPerspective {
    id: string = uuidv4();
    topic_id: string;
    question: string;
    context: string;
    ai_response: string;
    status: string = 'pending';
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(topic_id: string, question: string, context: string, ai_response: string) {
        this.topic_id = topic_id;
        this.question = question;
        this.context = context;
        this.ai_response = ai_response;
    }
}

// Conversation エンティティ (新規)
export class Conversation {
    id: string = uuidv4();
    topic_id: string;
    participant: string;
    summary: string | null = null;
    message_count: number = 0;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(topic_id: string, participant: string) {
        this.topic_id = topic_id;
        this.participant = participant;
    }
}

// DTO インターフェース
export interface UserDTO {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TopicDTO {
  id: string;
  user_id: string;
  title: string;
  stance: string;
  created_at: string;
  updated_at: string;
}

export interface AnticipatedQuestionDTO {
  id: string;
  topic_id: string;
  question: string;
  response: string;
  created_at: string;
  updated_at: string;
}

export interface NewPerspectiveDTO {
  id: string;
  topic_id: string;
  question: string;
  context: string;
  ai_response: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDTO {
  id: string;
  topic_id: string;
  participant: string;
  summary: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}
