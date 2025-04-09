"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  Topic, 
  AnticipatedQuestion, 
  NewPerspective, 
  Conversation 
} from "../entity";
import { 
  createUser, 
  getUsers,
  createTopic as dbCreateTopic, 
  getTopics as dbGetTopics,
  getTopicById as dbGetTopicById,
  getAnticipatedQuestionsByTopicId,
  createAnticipatedQuestion,
  getConversationsByTopicId,
  getConversations as dbGetConversations,
  getPendingNewPerspectives,
  createNewPerspective
} from "../repository";

// 現在のユーザーIDを取得するヘルパー関数（認証実装前の仮実装）
async function getCurrentUserId(): Promise<string> {
  // ユーザーが存在しなければ作成する
  const users = await getUsers();
  if (users.length === 0) {
    const user = new User('Default User');
    await createUser(user);
    return user.id;
  }
  return users[0].id;
}

export async function createTopic(data: {
  title: string
  stance: string
  anticipatedQuestions: { question: string; response: string }[]
}) {
  try {
    const userId = await getCurrentUserId();
    
    // トピックを作成
    const topic = new Topic(userId, data.title, data.stance);
    await dbCreateTopic(topic);
    
    // 想定質問を登録
    for (const q of data.anticipatedQuestions) {
      const question = new AnticipatedQuestion(
        topic.id,
        q.question,
        q.response
      );
      await createAnticipatedQuestion(question);
    }
    
    // キャッシュ更新
    revalidatePath("/topics");
    
    return { success: true, topicId: topic.id };
  } catch (error) {
    console.error("Error creating topic:", error);
    return { success: false, error: "Failed to create topic" };
  }
}

export async function getTopics() {
  try {
    const topics = await dbGetTopics();
    
    // トピックごとの追加情報を取得
    const enrichedTopics = await Promise.all(topics.map(async (topic) => {
      const anticipatedQuestions = await getAnticipatedQuestionsByTopicId(topic.id);
      const conversations = await getConversationsByTopicId(topic.id);
      
      // New Perspectives（フィードバック）の数を取得
      // 実際の実装では、statusがpendingのものだけをカウントする
      const pendingFeedback = await getPendingNewPerspectives();
      const topicPendingFeedback = pendingFeedback.filter(p => p.topic_id === topic.id).length;
      
      return {
        id: topic.id,
        title: topic.title,
        stance: topic.stance,
        questionCount: anticipatedQuestions.length,
        conversationCount: conversations.length,
        pendingFeedback: topicPendingFeedback,
      };
    }));
    
    return enrichedTopics;
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

export async function getPendingFeedback() {
  try {
    const pendingPerspectives = await getPendingNewPerspectives();
    
    // 各パースペクティブに対応するトピックのタイトルを取得
    const enrichedPerspectives = await Promise.all(pendingPerspectives.map(async (perspective) => {
      const topic = await dbGetTopicById(perspective.topic_id);
      
      return {
        id: perspective.id,
        topicTitle: topic ? topic.title : "Unknown Topic",
        question: perspective.question,
        context: perspective.context,
        aiResponse: perspective.ai_response,
        date: perspective.created_at.toISOString(),
      };
    }));
    
    return enrichedPerspectives;
  } catch (error) {
    console.error("Error fetching pending feedback:", error);
    return [];
  }
}

export async function getConversations() {
  try {
    const conversations = await dbGetConversations();
    
    // 各会話に対応するトピックのタイトルを取得
    const enrichedConversations = await Promise.all(conversations.map(async (conversation) => {
      const topic = await dbGetTopicById(conversation.topic_id);
      
      return {
        id: conversation.id,
        topicTitle: topic ? topic.title : "Unknown Topic",
        participant: conversation.participant,
        date: conversation.created_at.toISOString(),
        messageCount: conversation.message_count,
        summary: conversation.summary || "No summary available",
      };
    }));
    
    return enrichedConversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

export async function getTopicById(id: string) {
  try {
    const topic = await dbGetTopicById(id);
    if (!topic) return null;
    
    // トピックに関連する想定質問を取得
    const anticipatedQuestions = await getAnticipatedQuestionsByTopicId(id);
    const formattedQuestions = anticipatedQuestions.map(q => ({
      question: q.question,
      response: q.response,
    }));
    
    // トピックに関連する会話を取得
    const conversations = await getConversationsByTopicId(id);
    const formattedConversations = conversations.map(c => ({
      id: c.id,
      participant: c.participant,
      date: c.created_at.toISOString(),
      messageCount: c.message_count,
      summary: c.summary || "No summary available",
    }));
    
    return {
      id: topic.id,
      title: topic.title,
      stance: topic.stance,
      anticipatedQuestions: formattedQuestions,
      conversations: formattedConversations,
    };
  } catch (error) {
    console.error(`Error fetching topic with ID ${id}:`, error);
    return null;
  }
}

// Public discussion interface functions

export async function getPublicTopicById(id: string) {
  try {
    const topic = await dbGetTopicById(id);
    if (!topic) return null;
    
    // ユーザー情報を取得（実際の実装ではユーザープロフィールも取得）
    const userId = topic.user_id;
    
    return {
      id: topic.id,
      title: topic.title,
      ownerName: "Topic Owner", // 実際の実装ではユーザー名を取得
      ownerAvatar: "/placeholder.svg?height=48&width=48", // 実際の実装ではアバター画像のURLを取得
    };
  } catch (error) {
    console.error(`Error fetching public topic with ID ${id}:`, error);
    return null;
  }
}

export async function getTopicForDiscussion(id: string) {
  try {
    const topic = await dbGetTopicById(id);
    if (!topic) return null;
    
    // トピックに関連する想定質問を取得
    const anticipatedQuestions = await getAnticipatedQuestionsByTopicId(id);
    const formattedQuestions = anticipatedQuestions.map(q => ({
      question: q.question,
      response: q.response,
    }));
    
    return {
      id: topic.id,
      title: topic.title,
      ownerName: "Topic Owner", // 実際の実装ではユーザー名を取得
      stance: topic.stance,
      anticipatedQuestions: formattedQuestions,
    };
  } catch (error) {
    console.error(`Error fetching topic for discussion with ID ${id}:`, error);
    return null;
  }
}

export async function logNewPerspective(data: {
  topicId: string
  question: string
  context: string
  aiResponse: string
}) {
  try {
    const perspective = new NewPerspective(
      data.topicId,
      data.question,
      data.context,
      data.aiResponse
    );
    
    await createNewPerspective(perspective);
    return { success: true };
  } catch (error) {
    console.error("Error logging new perspective:", error);
    return { success: false, error: "Failed to log new perspective" };
  }
}
