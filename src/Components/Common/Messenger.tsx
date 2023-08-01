import {
  InsertLinkOutlined,
  InsertPhotoOutlined,
  Send,
  SentimentSatisfiedOutlined,
} from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import "./common.css";
import Pusher from "pusher-js";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
// import { NotificationMessageContext } from "./NotificationProvider";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import ApiMessage from "../../Services/Message";
// import { format } from "date-fns-tz";

/**
 * interface for Message
 * @property {number} to_user_id
 * @property {string} message
 */
export interface Message {
  to_user_id: number;
  message: string;
}

const Messenger = () => {
  // state for input message
  const [textInput, setTextInput] = useState("");

  // state for messages
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  // use context
  // const { updateNumber, updateNotifications } = useContext(
  //   NotificationMessageContext
  // );

  // use context to get to_user_id
  const { to_user, to_username, messages, conversationId } =
    useContext(ChatWithUserContext);

  // use Pusher
  var pusher = new Pusher("96e68ac1a93c911b481f", {
    cluster: "ap1",
  });

  // connect to pusher event 'chat'
  var channel = pusher.subscribe("Chat-Conversation-" + conversationId);

  // variable for the number of notification
  // var i = 0;

  // function handle messages
  const handleNewMessage = (data: Message) => {
    console.log(data);
    // format like: data = {"username": "John", "message": "Hi"}
    setAllMessages((prevMessages: any) => [...prevMessages, data]);

    // check current user
    // if (
    //   data.username !== JSON.parse(localStorage.getItem("user") as string).name
    // ) {
    //   i++;
    // }

    // update the number of notification
    // updateNumber(i);

    // update messages
    // updateNotifications(data);
  };

  // get messages from pusher
  useEffect(() => {
    channel.bind("message", handleNewMessage);
    return () => {
      channel.unbind("message", handleNewMessage);
    };
  }, [channel]);

  // function handle input message
  const handleSendMessage = () => {
    // get username from localstorage
    const data = {
      to_user_id: to_user,
      message: textInput,
    };

    // api post
    ApiMessage.storeMessage(data)
      .then((res) => {
        setTextInput("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Box
        maxHeight="70vh"
        height="100vh"
        px={3}
        overflow="auto"
        className="container"
      >
        {/* display message from DB*/}
        {messages.map((message, index) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser =
            message.to_user_id !==
            JSON.parse(localStorage.getItem("user") as string).id;
          const messageBox = isCurrentUser ? (
            <Box
              key={index}
              mt={2}
              p={2}
              bgcolor="#303841"
              borderRadius={2}
              display="flex"
              maxWidth={300}
              marginLeft="auto"
              justifyContent="space-between"
            >
              <Typography color="#eff2f7" fontSize={14} ml={3}>
                {message.message}
              </Typography>
              <Chip
                label={JSON.parse(localStorage.getItem("user") as string).name}
                sx={{ color: "#eff2f7" }}
              />
            </Box>
          ) : (
            <Box
              key={index}
              mt={2}
              p={2}
              bgcolor="#7269ef"
              borderRadius={2}
              display="flex"
              width="contents"
              marginRight="auto"
              maxWidth={300}
              justifyContent="space-between"
            >
              <Chip
                label={to_username}
                color="primary"
                sx={{ color: "#eff2f7" }}
              />
              <Typography color="#eff2f7" fontSize={14} mr={3}>
                {message.message}
              </Typography>
            </Box>
          );

          return messageBox;
        })}
        {/* display message realtime */}
        {allMessages.map((message, index) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser =
            message.to_user_id !==
            JSON.parse(localStorage.getItem("user") as string).id;
          const messageBox = isCurrentUser ? (
            <Box
              key={index}
              mt={2}
              p={2}
              bgcolor="#303841"
              borderRadius={2}
              display="flex"
              maxWidth={300}
              marginLeft="auto"
              justifyContent="space-between"
            >
              <Typography color="#eff2f7" fontSize={14} ml={3}>
                {message.message}
              </Typography>
              <Chip
                label={JSON.parse(localStorage.getItem("user") as string).name}
                sx={{ color: "#eff2f7" }}
              />
            </Box>
          ) : (
            <Box
              key={index}
              mt={2}
              p={2}
              bgcolor="#7269ef"
              borderRadius={2}
              display="flex"
              width="contents"
              marginRight="auto"
              maxWidth={300}
              justifyContent="space-between"
            >
              <Chip
                label={to_username}
                color="primary"
                sx={{ color: "#eff2f7" }}
              />
              <Typography color="#eff2f7" fontSize={14} mr={3}>
                {message.message}
              </Typography>
            </Box>
          );

          return messageBox;
        })}
      </Box>
      <Divider sx={{ bgcolor: "#36404a" }} />

      {/* Footer of screen */}
      <Box display="flex" p={2}>
        <TextField
          fullWidth
          placeholder="Enter message"
          sx={{
            bgcolor: "#ffffff26",
            borderRadius: 2,
            "& .MuiInputBase-input": {
              color: "#abb4d2",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#abb4d2", // Màu chữ của placeholder (đỏ)
              fontFamily: "Arial, sans-serif", // Font chữ của placeholder
            },
          }}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <IconButton sx={{ color: "#7a7f9a" }}>
          <SentimentSatisfiedOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <InsertLinkOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <InsertPhotoOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }} onClick={handleSendMessage}>
          <Send />
        </IconButton>
      </Box>
    </>
  );
};

export default Messenger;