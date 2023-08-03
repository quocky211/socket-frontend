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

export interface ToUser{
  toUserId: number,
  toUserName: string,
  toUserAvatar: string,
}
interface CommonContext {
  toUser: ToUser;
  conversationId: number;
  messages: Message[];
  changeUser: (toUser: ToUser) => void;
  updateMessages: (message: Message[]) => void;
  updateConversationId: (conversationId: number) => void;
}

// default value
const defaultValues = {
  toUser: {
    toUserId: 0,
    toUserName: "",
    toUserAvatar: "",
  },
  conversationId: 0,
  messages: [],
  changeUser: () => {},
  updateMessages: () => {},
  updateConversationId: () => {},
};

export const ChatWithUserContext = createContext<CommonContext>(defaultValues);

const ChatWithUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // state for to_user
  const [toUser, setToUser] = useState<ToUser>(defaultValues.toUser);

  // state for conversationId
  const [conversationId, setConversationId] = useState(
    defaultValues.conversationId
  );

  //state for messages
  const [messages, setMessages] = useState<Message[]>(defaultValues.messages);
  // state for index Avatar
  // function change User
  const changeUser = (toUser: ToUser) => {
    setToUser(toUser)
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
    toUser,
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
