import { v4 as uuidv4 } from 'uuid';
export class User {
    id: string = uuidv4();
    created_at: Date = new Date();
    updated_at: Date = new Date();
}

export class Agenda {
    id: string = uuidv4();
    name: string;
    description: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

export class Knowledge {
    id: string = uuidv4();
    question: string;
    answer: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(question: string, answer: string) {
        this.question = question;
        this.answer = answer;
    }
}

export class Curiosity {
    id: string = uuidv4();
    agenda_id: string = '';
    question: string = '';
    created_at: Date = new Date();
    updated_at: Date = new Date();
}

export interface AgendaDTO {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeDTO {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}
