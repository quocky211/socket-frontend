import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import NavBar from "../Common/Navbar";
import Chat from "../Common/Chat";
import TopBarChat from "../Common/TopBarChat";
import Messenger, { Message } from "../Common/Messenger";
import { FeatureContext } from "../Common/FeatureProvider";
import Notification from "../Common/Notification";
import Pusher from "pusher-js";
import { ChatWithUserContext } from "../Common/ChatWithUserProvider";
import SettingAccount from "../Common/SettingAccount";

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
  return (
    <Box display="grid" gridTemplateColumns="0.5fr 2fr 3fr" height="100%">
      <Box bgcolor="#36404a">
        <NavBar />
      </Box>
      <Box bgcolor="#303841">
        {feature === "chat" && <Chat pusherMessages={pusherMessages} setPusherMessages={setPusherMessages} setIsLoading={setIsLoading}/>}
        {feature === "notification" && <Notification />}
        {feature === "setting" && <SettingAccount/>}
      </Box>
      <Box width="100%" height="100vh" bgcolor="#262e35">
        <TopBarChat />
        <Messenger pusherMessages={pusherMessages} isLoading={isLoading}/>
      </Box>
    </Box>
  );
};

export default PageChat;
