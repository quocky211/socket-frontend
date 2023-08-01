import { FC, ReactNode, createContext, useState } from "react";
import { Message } from "./Messenger";

/**
 * interface CommonText
 * @property {number} to_user
 * @property {string} to_username
 * @property {number} conversationId 
 * @property {Message[]} messages
 * @function changeUser()
 * @function updateMessages()
 * @fucntion updateConversationId()
 */
interface CommonContext {
  to_user: number;
  to_username: string;
  conversationId: number;
  messages: Message[];
  changeUser: (to_user: number, to_username: string) => void;
  updateMessages: (message: Message[]) => void;
  updateConversationId: (conversationId: number) => void;
}

// default value
const defaultValues = {
  to_user: 0,
  to_username: "",
  conversationId: 0,
  messages: [],
  changeUser: () => {},
  updateMessages: () => {},
  updateConversationId: () => {},
};

export const ChatWithUserContext = createContext<CommonContext>(defaultValues);

const ChatWithUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // state for to_user
  const [to_user, setToUser] = useState(defaultValues.to_user);

  // state for to_username
  const [to_username, setToUsername] = useState(defaultValues.to_username);

  // state for conversationId
  const [conversationId, setConversationId] = useState(
    defaultValues.conversationId
  );

  //state for messages
  const [messages, setMessages] = useState<Message[]>(defaultValues.messages);

  // function change User
  const changeUser = (to_user: number, to_username: string) => {
    setToUser(to_user);
    setToUsername(to_username);
  };

  // function update message
  const updateMessages = (messages: Message[]) => {
    setMessages(messages);
  };

  // fucntion update conversation id
  const updateConversationId = (conversationId: number) => {
    setConversationId(conversationId);
  };

  // dynamic value for use context
  const dynamicValues = {
    to_user,
    to_username,
    conversationId,
    messages,
    changeUser,
    updateMessages,
    updateConversationId,
  };
  return (
    <ChatWithUserContext.Provider value={dynamicValues}>
      {children}
    </ChatWithUserContext.Provider>
  );
};

export default ChatWithUserProvider;
