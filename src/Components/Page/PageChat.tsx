import { Box } from "@mui/material";
import React, { useContext } from "react";
import NavBar from "../Common/Navbar";
import Chat from "../Common/Chat";
import TopBarChat from "../Common/TopBarChat";
import Messenger from "../Common/Messenger";
import { FeatureContext } from "../Common/FeatureProvider";
import Notification from "../Common/Notification";

const PageChat = () => {
  const { feature } = useContext(FeatureContext);
  return (
    <Box display="grid" gridTemplateColumns="0.5fr 2fr 3fr" height="100%">
      <Box bgcolor="#36404a">
        <NavBar />
      </Box>
      <Box bgcolor="#303841">
        {feature === "chat" && <Chat />}
        {feature === "notification" && <Notification />}
      </Box>
      <Box width="100%" height="100vh" bgcolor="#262e35">
        <TopBarChat />
        <Messenger />
      </Box>
    </Box>
  );
};

export default PageChat;
