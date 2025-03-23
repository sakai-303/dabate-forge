"use server";

import { Agenda, Knowledge, AgendaDTO, KnowledgeDTO } from "../../../../entity";

export async function getAgenda(id: string): Promise<AgendaDTO> {
  const agenda = new Agenda("", "");
  return {
    id: agenda.id,
    name: agenda.name,
    description: agenda.description,
    created_at: agenda.created_at.toISOString(),
    updated_at: agenda.updated_at.toISOString()
  };
}

export async function getKnowledgeByAgendaId(agendaId: string): Promise<KnowledgeDTO[]> {
  const knowledgeList: Knowledge[] = [];
  return knowledgeList.map(k => ({
    id: k.id,
    question: k.question,
    answer: k.answer,
    created_at: k.created_at.toISOString(),
    updated_at: k.updated_at.toISOString()
  }));
}

export async function saveAgenda(data: { agenda: AgendaDTO, knowledgeList: KnowledgeDTO[] }): Promise<{ success: boolean }> {
  console.log("Received agenda data:", data);
  return { success: true };
}
