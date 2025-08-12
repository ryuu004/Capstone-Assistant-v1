import { ConversationProvider } from '../context/ConversationContext';
import ChatClientLayout from './ChatClientLayout';

export default function ChatLayout({ children }) {
  return (
    <ConversationProvider>
        <ChatClientLayout>
            {children}
        </ChatClientLayout>
    </ConversationProvider>
  );
}