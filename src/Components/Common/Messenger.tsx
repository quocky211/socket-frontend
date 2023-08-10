import { ContentCopy, DeleteOutlined, InsertLinkOutlined, InsertPhotoOutlined, MoreVert, Send, SentimentSatisfiedOutlined } from "@mui/icons-material";
import React, { FC, useContext, useEffect, useState } from "react";
import "../css/common.css";
import { Avatar, Box, Button, CircularProgress, Divider, IconButton, Menu, MenuItem, MenuList, TextField, Typography } from "@mui/material";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import ApiMessage from "../../Services/Message";
import { useRef } from "react";

/**
 * interface for Message
 * @property {number} to_user_id
 * @property {string} message
 * @property {string} image
 */
export interface Message {
  to_user_id: number;
  message: string;
  image: string;
}

const Messenger: FC<{ pusherMessages: Message[]; isLoading?: boolean }> = ({
  pusherMessages,
  isLoading,
}) => {
  // state for input message
  const [textInput, setTextInput] = useState("");
  // state for input file
  const [file, setFile] = useState<File | null>(null);
  // screen messenger
  const containerRef = useRef<HTMLDivElement>(null);
  function scrollToBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
    }
  }

  // open menu for each message
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = "primary-search-account-menu";
  // component menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: -20,
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 100,
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuList sx={{ bgcolor: "#36404a", borderRadius: 0 }}>
        <MenuItem
          sx={{ justifyContent: "space-around", width: 170, py: 2 }}
          onClick={handleMenuClose}
        >
          <Typography color="#a6b0cf" fontSize={15}>
            Copy
          </Typography>
          <ContentCopy sx={{ color: "#a6b0cf", fontSize: 15 }} />
        </MenuItem>
        <MenuItem
          sx={{ justifyContent: "space-around", width: 170, py: 2 }}
          onClick={handleMenuClose}
        >
          <Typography color="#a6b0cf" fontSize={15}>
            Delete
          </Typography>
          <DeleteOutlined sx={{ color: "#a6b0cf", fontSize: 15 }} />
        </MenuItem>
      </MenuList>
    </Menu>
  );

  // use context to get to_user_id
  const { toUser, messages } = useContext(ChatWithUserContext);
  // use to scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ref for input type file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = () => {
    const selectedFile = fileInputRef.current?.files?.[0];
    if (selectedFile) {
      console.log(selectedFile);
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
      to_user_id: toUser.toUserId,
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
      <Box maxHeight="70vh" height="100vh" px={3} className="container" ref={containerRef} sx={{ overflowY: "auto" }}>
        {isLoading ? (
          <CircularProgress color="inherit" sx={{ position: "absolute", top: 250 }}/>
        ) : (
          <></>
        )}
        {/* display message from DB*/}
        {messages.map((message, index) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser = message.to_user_id != JSON.parse(localStorage.getItem("user") as string).id;
          const messageBox = isCurrentUser ? (
            <Box textAlign="end">
              <Box display="flex" justifyContent="flex-end">
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    sx={{ color: "#7269ef", p: 0, mt: 2 }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                {renderMenu}
                {/* Message */}
                <Box
                  key={index}
                  sx={{
                    mr: 7,
                    borderRadius: "8px 8px 0 8px",
                    mt: 2,
                    px: 5,
                    py: 2,
                    bgcolor: "#303841",
                    display: "inline-block",
                    position: "relative",
                    "&::before": {
                      borderBottom: "5px solid transparent",
                      borderRight: "5px solid #303841",
                      borderLeft: "5px solid transparent",
                      borderTop: "5px solid #303841",
                      bottom: "-9px",
                      content: '""',
                      right: 0,
                      position: "absolute",
                      left: "auto",
                    },
                  }}
                >
                  <Typography color="#eff2f7" fontSize={14}>
                    {message.message}
                  </Typography>
                  {message.image ? (
                    <a href={message.image}>
                      <img
                        src={message.image}
                        alt="Download file"
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "fill",
                          borderRadius: 4,
                          borderColor: "black",
                        }}
                      />
                    </a>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
              {/* Avatar and username */}
              <Box display="flex" alignItems="end" justifyContent="flex-end">
                <Typography color="#a6b0cf" fontSize={14} marginRight={2}>
                  {JSON.parse(localStorage.getItem("user") as string).name}
                </Typography>
                <Avatar
                  src={
                    JSON.parse(localStorage.getItem("user") as string).avatar
                  }
                  alt={JSON.parse(localStorage.getItem("user") as string).name}
                />
              </Box>
            </Box>
          ) : (
            <Box textAlign="left">
              <Box display="flex">
                {/* Message */}
                <Box
                  key={index}
                  sx={{
                    ml: 7,
                    borderRadius: "8px 8px 8px 0",
                    mt: 2,
                    px: 5,
                    py: 2,
                    bgcolor: "#7269ef",
                    display: "inline-block",
                    position: "relative",
                    "&::before": {
                      borderBottom: "5px solid transparent",
                      borderLeft: "5px solid #7269ef",
                      borderRight: "5px solid transparent",
                      borderTop: "5px solid #7269ef",
                      bottom: "-9px",
                      content: '""',
                      left: 0,
                      position: "absolute",
                      right: "auto",
                    },
                  }}
                >
                  {message.image ? (
                    <a href={message.image}>
                      <img
                        src={message.image}
                        alt="Download file"
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "fill",
                          borderRadius: 4,
                          borderColor: "black",
                        }}
                      />
                    </a>
                  ) : (
                    <></>
                  )}
                  <Typography color="#eff2f7" fontSize={14}>
                    {message.message}
                  </Typography>
                </Box>
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    sx={{ color: "#7269ef", p: 0, mt: 2 }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
              {/* Avatar and username */}
              <Box display="flex" alignItems="end">
                <Avatar src={toUser.toUserAvatar} alt={toUser.toUserName} />
                <Typography color="#a6b0cf" fontSize={14} marginLeft={2}>
                  {toUser.toUserName}
                </Typography>
              </Box>
            </Box>
          );
          return messageBox;
        })}
        {/* display message realtime */}
        {pusherMessages.map((message, index, array) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser = message.to_user_id != JSON.parse(localStorage.getItem("user") as string).id;
          const messageBox = isCurrentUser ? (
            <Box textAlign="end">
              <Box display="flex" justifyContent="flex-end">
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    sx={{ color: "#7269ef", p: 0, mt: 2 }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                {renderMenu}
                {/* Message */}
                <Box
                  key={index}
                  sx={{
                    mr: 7,
                    borderRadius: "8px 8px 0 8px",
                    mt: 2,
                    px: 5,
                    py: 2,
                    bgcolor: "#303841",
                    display: "inline-block",
                    position: "relative",
                    "&::before": {
                      borderBottom: "5px solid transparent",
                      borderRight: "5px solid #303841",
                      borderLeft: "5px solid transparent",
                      borderTop: "5px solid #303841",
                      bottom: "-9px",
                      content: '""',
                      right: 0,
                      position: "absolute",
                      left: "auto",
                    },
                  }}
                >
                  <Typography color="#eff2f7" fontSize={14}>
                    {message.message}
                  </Typography>
                  {message.image ? (
                    <a href={message.image}>
                      <img
                        src={message.image}
                        alt="Download file"
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "fill",
                          borderRadius: 4,
                          borderColor: "black",
                        }}
                      />
                    </a>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
              {/* Avatar and username */}
              <Box display="flex" alignItems="end" justifyContent="flex-end">
                <Typography color="#a6b0cf" fontSize={14} marginRight={2}>
                  {JSON.parse(localStorage.getItem("user") as string).name}
                </Typography>
                <Avatar
                  src={
                    JSON.parse(localStorage.getItem("user") as string).avatar
                  }
                  alt={JSON.parse(localStorage.getItem("user") as string).name}
                />
              </Box>
            </Box>
          ) : (
            <Box textAlign="left">
              <Box display="flex">
                {/* Message */}
                <Box
                  key={index}
                  sx={{
                    ml: 7,
                    borderRadius: "8px 8px 8px 0",
                    mt: 2,
                    px: 5,
                    py: 2,
                    bgcolor: "#7269ef",
                    display: "inline-block",
                    position: "relative",
                    "&::before": {
                      borderBottom: "5px solid transparent",
                      borderLeft: "5px solid #7269ef",
                      borderRight: "5px solid transparent",
                      borderTop: "5px solid #7269ef",
                      bottom: "-9px",
                      content: '""',
                      left: 0,
                      position: "absolute",
                      right: "auto",
                    },
                  }}
                >
                  {message.image ? (
                    <a href={message.image}>
                      <img
                        src={message.image}
                        alt="Download file"
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "fill",
                          borderRadius: 4,
                          borderColor: "black",
                        }}
                      />
                    </a>
                  ) : (
                    <></>
                  )}
                  <Typography color="#eff2f7" fontSize={14}>
                    {message.message}
                  </Typography>
                </Box>
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    sx={{ color: "#7269ef", p: 0, mt: 2 }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
              {/* Avatar and username */}
              <Box display="flex" alignItems="end">
                <Avatar src={toUser.toUserAvatar} alt={toUser.toUserName} />
                <Typography color="#a6b0cf" fontSize={14} marginLeft={2}>
                  {toUser.toUserName}
                </Typography>
              </Box>
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
      </Box>
    </>
  );
};

export default Messenger;
