import { Box } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import NavBar from "../Common/Navbar";
import Chat from "../Common/Chat";
import TopBarChat from "../Common/TopBarChat";
import Messenger, { Message } from "../Common/Messenger";
import { FeatureContext } from "../Common/FeatureProvider";
import Notification from "../Common/Notification";
import Pusher from "pusher-js";
import { ChatWithUserContext } from "../Common/ChatWithUserProvider";
import SettingAccount from "../Common/SettingAccount";
import Contact from "../Common/Contact";

const PageChat = () => {
  const { feature } = useContext(FeatureContext);
  const { conversationId } = useContext(ChatWithUserContext);
  const [pusherMessages, setPusherMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // use Pusher
  var pusher = new Pusher("96e68ac1a93c911b481f", {
    cluster: "ap1",
  });
  // connect to pusher event 'chat'
  var channel = pusher.subscribe("Chat-Conversation-" + conversationId);
  const handleNewMessage = (data: Message) => {
    // pusherMessages.push(data);
    setPusherMessages((prevMessages: any) => [...prevMessages, data]);
  };
  // get messages from pusher
  useEffect(() => {
    channel.bind("message", handleNewMessage);
    return () => {
      channel.unbind("message", handleNewMessage);
    };
  }, [channel]);

  // search
  const messagesRef = useRef<HTMLDivElement[]>([]);
  const scrollToMessage = (messageId: number) => {
    const messageRef = messagesRef.current[messageId];
    if (messageRef) {
      messageRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "0.3fr 1.5fr 3fr" }}
      height="100%"
    >
      <Box bgcolor="#36404a" sx={{ display: { xs: "none", md: "block" } }}>
        <NavBar style={{ display: "grid" }} />
      </Box>
      <Box bgcolor="#36404a" sx={{ display: { xs: "block", sm: "none" } }}>
        <NavBar
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: 0,
          }}
        />
      </Box>
      <Box bgcolor="#303841">
        {feature === "chat" && (
          <Chat
            pusherMessages={pusherMessages}
            setPusherMessages={setPusherMessages}
            setIsLoading={setIsLoading}
          />
        )}
        {feature === "notification" && <Notification />}
        {feature === "setting" && <SettingAccount />}
        {feature === "contact" && <Contact />}
      </Box>
      <Box width="100%" height="100vh" bgcolor="#262e35">
        <TopBarChat
          setPusherMessages={setPusherMessages}
          scrollToMessage={scrollToMessage}
        />
        <Messenger
          pusherMessages={pusherMessages}
          isLoading={isLoading}
          setPusherMessages={setPusherMessages}
          messagesRef={messagesRef}
        />
      </Box>
    </Box>
  );
};

export default PageChat;
