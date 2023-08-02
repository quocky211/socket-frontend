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
  Button,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import ApiMessage from "../../Services/Message";
import { useRef } from "react";

/**
 * interface for Message
 * @property {number} to_user_id
 * @property {string} message
 */
export interface Message {
  to_user_id: number;
  message: string;
  image: string;
}

const Messenger = () => {
  // state for input message
  const [textInput, setTextInput] = useState("");
  // state for input file
  const [file, setFile] = useState<File | null>(null);
  // state for messages
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  // screen messenger
  const containerRef = useRef<HTMLDivElement>(null);
  function scrollToBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
    }
  }

  // use context to get to_user_id
  const { to_user, to_username, messages, conversationId } =
    useContext(ChatWithUserContext);
  // use to scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // use Pusher
  var pusher = new Pusher("96e68ac1a93c911b481f", {
    cluster: "ap1",
  });

  // connect to pusher event 'chat'
  var channel = pusher.subscribe("Chat-Conversation-" + conversationId);

  // function handle messages
  const handleNewMessage = (data: Message) => {
    setAllMessages((prevMessages: any) => [...prevMessages, data]);
  };

  // get messages from pusher
  useEffect(() => {
    channel.bind("message", handleNewMessage);
    return () => {
      channel.unbind("message", handleNewMessage);
    };
  }, [channel]);

  // ref for input type file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = () => {
    const selectedFile = fileInputRef.current?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // image input
  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };
  const handleImageChange = () => {
    const selectedImage = imageInputRef.current?.files?.[0];
    if (selectedImage) {
      setFile(selectedImage);
    }
  };
  // display for input field
  const sendMess = file ? file : textInput;

  // function handle input message
  const handleSendMessage = () => {
    // get username from localstorage
    const data = {
      to_user_id: to_user,
      message: textInput,
      image: file,
    };
    // api post
    ApiMessage.storeMessage(data)
      .then((res) => {
        setTextInput("");
        setFile(null);
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
        className="container"
        ref={containerRef}
        sx={{ overflowY: "auto" }}
      >
        {/* display message from DB*/}
        {messages.map((message, index) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser =
            message.to_user_id !=
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
              {message.image ? (
                <img
                  src={message.image}
                  alt="hinh anh"
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "fill",
                    borderRadius: 4,
                    borderColor: "black",
                  }}
                />
              ) : (
                <></>
              )}
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
              {message.image ? (
                <img
                  src={message.image}
                  alt="hinh anh"
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "fill",
                    borderRadius: 4,
                    borderColor: "black",
                  }}
                />
              ) : (
                <></>
              )}
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
            message.to_user_id !=
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
              {message.image ? (
                <img
                  src={message.image}
                  alt="hinh anh"
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "fill",
                    borderRadius: 4,
                    borderColor: "black",
                  }}
                />
              ) : (
                <></>
              )}
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
              {message.image ? (
                <img
                  src={message.image}
                  alt="hinh anh"
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "fill",
                    borderRadius: 4,
                    borderColor: "black",
                  }}
                />
              ) : (
                <></>
              )}
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
        {/* <form encType="multipart/form-data" style={{ display: "contents" }}> */}
        <TextField
          fullWidth
          placeholder="Enter message"
          required
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
          value={sendMess}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <IconButton sx={{ color: "#7a7f9a" }}>
          <SentimentSatisfiedOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <InsertLinkOutlined onClick={handleFileButtonClick} />
          {/* must input tag */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <InsertPhotoOutlined onClick={handleImageButtonClick} />
          <input
            type="file"
            ref={imageInputRef}
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </IconButton>
        <Button
          sx={{ background: "#1976d2", borderRadius: 2 }}
          onClick={handleSendMessage}
        >
          <IconButton>
            <Send sx={{ color: "white" }} />
          </IconButton>
        </Button>
        {/* </form> */}
      </Box>
    </>
  );
};

export default Messenger;
