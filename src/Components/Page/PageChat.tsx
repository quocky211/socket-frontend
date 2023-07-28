import { Box } from "@mui/material";
import React from "react";
import NavBar from "../Common/Navbar";
import Chat from "../Common/Chat";
import TopBarChat from "../Common/TopBarChat";
import Messenger from "../Common/Messenger";
import FooterChat from "../Common/FooterChat";

const PageChat = () => {
  return (
    <Box display="grid" gridTemplateColumns="0.5fr 2fr 3fr" height="100%">
      <Box bgcolor="#36404a">
        <NavBar />
      </Box>
      <Box bgcolor="#303841">
        <Chat />
      </Box>
      <Box width="100%" bgcolor="#262e35">
        <TopBarChat />
        <Messenger />
        <FooterChat />
      </Box>
    </Box>
  );
};

export default PageChat;
