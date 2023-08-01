import { FC, ReactNode, createContext, useState } from "react";
import {NotiMessage} from "./Navbar";
/**
 * interface fot CommonContext
 * @property {number} theNuNotification
 * @property {NotiMessage[]} notifications
 * @property {void} updateNumber
 * @property {void} updateNotifications
 */
interface CommonContext {
  theNuNotification: number;
  notifications: NotiMessage[]; // notifications
  updateNumber: (theNuNotification: number) => void;
  updateNotifications: (notification: NotiMessage) => void;
}

// default value
const defaulValues = {
  theNuNotification: 0,
  notifications: [],
  updateNumber: () => {},
  updateNotifications: () => {},
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

  // state for notifications
  const [notifications, setNotifications] = useState<NotiMessage[]>([]);

  // fucntion upadateNumber
  const updateNumber = (theNuNotification: number) =>
    setTheNumberNotification(theNuNotification);

  // function updateNotifications
  const updateNotifications = (data: NotiMessage) =>
    setNotifications((prevnotifications: any) => [...prevnotifications, data]);
  const notificationDynamic = {
    theNuNotification,
    notifications,
    updateNumber,
    updateNotifications,
  };

  return (
    <NotificationMessageContext.Provider value={notificationDynamic}>
      {children}
    </NotificationMessageContext.Provider>
  );
};

export default NotificationMessageProvider;
