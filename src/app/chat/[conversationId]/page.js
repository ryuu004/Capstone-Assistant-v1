import ChatInterface from '../../components/ChatInterface'; // Using relative path

export default async function ConversationChatPage({ params }) {
  const { conversationId } = params;
  return <ChatInterface initialConversationId={conversationId} />;
}