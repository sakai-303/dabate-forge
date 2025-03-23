"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { use, useEffect, useState } from "react";
import { AgendaDTO, KnowledgeDTO } from "../../../../entity";
import { getAgenda, getKnowledgeByAgendaId, saveAgenda } from "./action";

export default function CentralPage({ params }: { params: Promise<{ id: string }> }) {
  const agendaId = use(params).id;
  const router = useRouter();

  const [agenda, setAgenda] = useState<AgendaDTO>({
    id: "",
    name: "",
    description: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeDTO[]>([]);

  const [agendaLoaded, setAgendaLoaded] = useState(false);
  const [knowledgeLoaded, setKnowledgeLoaded] = useState(false);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const agenda = await getAgenda(agendaId);
        setAgenda(agenda);
        setAgendaLoaded(true);
      }
      catch (error) {
        router.push("/error/500");
      }
    };

    const fetchKnowledge = async () => {
      try {
        const knowledgeList = await getKnowledgeByAgendaId(agendaId);
        setKnowledgeList(knowledgeList);
        setKnowledgeLoaded(true);
      }
      catch (error) {
        router.push("/error/500");
      }
    }

    fetchAgenda();
    if (!agenda) {
      router.push("/error/404");
    }

    fetchKnowledge();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await saveAgenda({
      agenda: agenda,
      knowledgeList: knowledgeList
    });
  };

  const addKnowledge = () => {
    const newKnowledge: KnowledgeDTO = {
      id: "",
      question: "",
      answer: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setKnowledgeList([...knowledgeList, newKnowledge]);
  };

  if (!agendaLoaded || !knowledgeLoaded) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">議題を読み込み中...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">議題と想定Q&Aを入力 (ID: {agendaId})</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">議題</label>
          <textarea
            value={agenda.description}
            onChange={(e) => setAgenda({
              ...agenda,
              description: e.target.value
            })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {knowledgeList.map((k, i) => (
          <div key={i} className="mb-4">
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">想定質問 {i + 1}</label>
                  <input
                    value={k.question}
                    onChange={(e) => {
                      const newKnowledgeList = [...knowledgeList];
                      newKnowledgeList[i].question = e.target.value;
                      setKnowledgeList(newKnowledgeList);
                    }}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">想定回答 {i + 1}</label>
                  <textarea
                    value={k.answer}
                    onChange={(e) => {
                      const newKnowledgeList = [...knowledgeList];
                      newKnowledgeList[i].answer = e.target.value;
                      setKnowledgeList(newKnowledgeList);
                    }}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newQuestions = knowledgeList.filter((_, idx) => idx !== i);
                  setKnowledgeList(newQuestions);
                }}
                className="mt-2 text-red-500 hover:text-red-700 text-sm"
              >
                この質問を削除
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addKnowledge}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          質問を追加
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          保存
        </button>
      </form>
    </div>
  );
}
