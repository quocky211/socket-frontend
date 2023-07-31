import { FC, ReactNode, createContext, useState } from "react";
import { Message } from "./Messenger";

/**
 * interface fot CommonContext
 * @property {number} theNuNotification
 * @property {Message[]} messages
 * @property {void} updateNumber
 * @property {void} updateMessages
 */
interface CommonContext {
  theNuNotification: number;
  messages: Message[];
  updateNumber: (theNuNotification: number) => void;
  updateMessages: (message: Message) => void;
}

// default value
const defaulValues = {
  theNuNotification: 0,
  messages: [],
  updateNumber: () => {},
  updateMessages: () => {},
};

// export NotificationMessageContext
export const NotificationMessageContext =
  createContext<CommonContext>(defaulValues);

const NotificationMessageProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // state for theNuNotification
  const [theNuNotification, setTheNumberNotification] = useState(
    defaulValues.theNuNotification
  );

  // state for messages
  const [messages, setMessages] = useState<Message[]>([]);

  // fucntion upadateNumber
  const updateNumber = (theNuNotification: number) =>
    setTheNumberNotification(theNuNotification);

  // function updateMessages
  const updateMessages = (data: Message) =>
    setMessages((prevMessages: any) => [...prevMessages, data]);
  const notificationDynamic = {
    theNuNotification,
    messages,
    updateNumber,
    updateMessages,
  };

  return (
    <NotificationMessageContext.Provider value={notificationDynamic}>
      {children}
    </NotificationMessageContext.Provider>
  );
};

export default NotificationMessageProvider;
