import {
  ContentCopy,
  DeleteOutlined,
  InsertLinkOutlined,
  InsertPhotoOutlined,
  MoreVert,
  Send,
  SentimentSatisfiedOutlined,
  QueryBuilderOutlined,
} from "@mui/icons-material";
import React, {
  FC,
  MutableRefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import "../css/common.css";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import ApiMessage from "../../Services/Message";
import { useRef } from "react";
import Pusher from "pusher-js";
import { makeStyles } from "@mui/styles";
/**
 * interface for Message
 * @property {number} to_user_id
 * @property {string} message
 * @property {string} image
 */
export interface Message {
  id: any; // pusher convert to string
  to_user_id: number;
  message: string;
  image: string;
  created_at: Date;
}

export const useStyles: any = makeStyles((theme: Theme) => ({
  menuPaper: {
    backgroundColor: "#36404a",
    boxShadow: "none",
  },
}));

const Messenger: FC<{
  pusherMessages: Message[];
  isLoading?: boolean;
  messagesRef: MutableRefObject<HTMLDivElement[]>;
  setPusherMessages: (pusherMessage: Message[]) => void;
}> = ({ pusherMessages, isLoading, messagesRef, setPusherMessages }) => {
  // state for input message
  const [textInput, setTextInput] = useState("");
  // state for input file
  const [file, setFile] = useState<File | null>(null);
  // screen messenger
  const containerRef = useRef<HTMLDivElement>(null);
  // state for copy message
  const [copied, setCopied] = useState("");
  // state for delete message
  const [messageId, setMessageId] = useState(0);
  // state for display remove message for blue chat
  const [openRemoveChat, setOpenRemoveChat] = useState(false);
  function scrollToBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
    }
  }
  const classes: any = useStyles();

  // open menu for each message
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (e: any, id: number, text: string) => {
    setMessageId(id);
    setOpenRemoveChat(true);
    setCopied(text);
    setAnchorEl(e.currentTarget);
  };
  const handleProfileMenuOpenBlue = (e: any, text: string) => {
    setCopied(text);
    setOpenRemoveChat(false);
    setAnchorEl(e.currentTarget);
  };
  // handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // use context to get to_user_id
  const { toUser, messages, conversationId, updateMessages } =
    useContext(ChatWithUserContext);
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

  // display hour
  const formatTime = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  // copy message
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(copied)
      .then(() => {
        handleMenuClose();
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  // delete message
  const handleDeleteClick = () => {
    ApiMessage.deleteMessage(messageId)
      .then((res) => {
        ApiMessage.getMessagesWithUser(toUser.toUserId)
          .then((res1) => {
            updateMessages(res1.data);
            setPusherMessages([]);
            handleMenuClose();
          })
          .catch((err1) => {
            console.log(err1);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // after delete have to use Pusher to synchronize with other chat
  var pusher = new Pusher("96e68ac1a93c911b481f", {
    cluster: "ap1",
  });

  var channel = pusher.subscribe("Delete-Message-" + conversationId);

  const handleUpdateChat = (data: any) => {
    console.log(data);
    if (data) {
      ApiMessage.getMessagesWithUser(toUser.toUserId)
        .then((res1) => {
          setPusherMessages([]);
          updateMessages(res1.data);
        })
        .catch((err1) => {
          console.log(err1);
        });
    }
  };

  useEffect(() => {
    channel.bind("deleteMessage", handleUpdateChat);
    return () => {
      channel.unbind("deleteMessage", handleUpdateChat);
    };
  }, [channel]);
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
      classes={{ paper: classes.menuPaper }}
      keepMounted
      transformOrigin={{
        vertical: 30,
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuList sx={{ bgcolor: "#36404a", borderRadius: 0 }}> */}
      <MenuItem
        sx={{ justifyContent: "space-between", width: 170, py: 2, px: 3 }}
        onClick={handleCopyClick}
      >
        <Typography color="#a6b0cf" fontSize={15}>
          Copy
        </Typography>
        <ContentCopy sx={{ color: "#a6b0cf", fontSize: 15 }} />
      </MenuItem>
      {openRemoveChat ? (
        <MenuItem
          sx={{ justifyContent: "space-between", width: 170, py: 2, px: 3 }}
          onClick={handleDeleteClick}
        >
          <Typography color="#a6b0cf" fontSize={15}>
            Remove
          </Typography>
          <DeleteOutlined sx={{ color: "#a6b0cf", fontSize: 16 }} />
        </MenuItem>
      ) : (
        <Box></Box>
      )}
      {/* </MenuList> */}
    </Menu>
  );

  // realtime typing feature
  const [isTyping, setIsTyping] = useState(false);
  const [fromUserId, setFromUserId] = useState(0);
  const handleInputFocus = () => {
    const payload = {
      isTyping: true,
      conversationId: conversationId,
    };
    ApiMessage.typingMessage(payload)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  const handleInputBlur = () => {
    const payload = {
      isTyping: false,
      conversationId: conversationId,
    };
    ApiMessage.typingMessage(payload)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  var channelTyping = pusher.subscribe("Typing-Channel-" + conversationId);

  const handleUpdateTyping = (data: any) => {
    setIsTyping(data.isTyping);
    setFromUserId(data.from_user_id);
  };

  useEffect(() => {
    channelTyping.bind("typing-event", handleUpdateTyping);
    return () => {
      channelTyping.unbind("typing-event", handleUpdateTyping);
    };
  }, [channelTyping]);

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
        {isLoading ? (
          <CircularProgress
            color="inherit"
            sx={{ position: "absolute", top: 250 }}
          />
        ) : (
          <></>
        )}
        {/* display message from DB*/}
        {messages.map((message, index) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser =
            message.to_user_id !=
            JSON.parse(localStorage.getItem("user") as string).id;
          const formattedTime = formatTime(message.created_at);
          const messageBox = isCurrentUser ? (
            <Box
              textAlign="end"
              ref={(ref) =>
                (messagesRef.current[message.id] = ref as HTMLDivElement)
              }
            >
              <Box display="flex" justifyContent="flex-end">
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleProfileMenuOpen(e, message.id, message.message)
                    }
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
                    py: "12px",
                    px: "20px",
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
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    mt={2}
                  >
                    <QueryBuilderOutlined
                      sx={{ fontSize: 12, color: "#ffffff80", mr: "3px" }}
                    />
                    <Typography color="#ffffff80" fontSize={12}>
                      {formattedTime}
                    </Typography>
                  </Box>
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
            <Box
              textAlign="left"
              ref={(ref) =>
                (messagesRef.current[message.id] = ref as HTMLDivElement)
              }
            >
              <Box display="flex">
                {/* Message */}
                <Box
                  key={index}
                  sx={{
                    ml: 7,
                    borderRadius: "8px 8px 8px 0",
                    mt: 2,
                    py: "12px",
                    px: "20px",
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
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={2}
                  >
                    <QueryBuilderOutlined
                      sx={{ fontSize: 12, color: "#ffffff80", mr: "3px" }}
                    />
                    <Typography color="#ffffff80" fontSize={12}>
                      {formattedTime}
                    </Typography>
                  </Box>
                </Box>
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleProfileMenuOpenBlue(e, message.message)
                    }
                    sx={{ color: "#7269ef", p: 0, mt: 2 }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                {renderMenu}
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
        {pusherMessages.map((message, index) => {
          // check message: message from the current user will have bg: #303841 and the others: #7269ef
          const isCurrentUser =
            message.to_user_id !=
            JSON.parse(localStorage.getItem("user") as string).id;
          const formattedTime = formatTime(message.created_at);
          const messageBox = isCurrentUser ? (
            <Box textAlign="end">
              <Box display="flex" justifyContent="flex-end">
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleProfileMenuOpen(
                        e,
                        parseInt(message.id, 10) as number,
                        message.message
                      )
                    }
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
                    py: "12px",
                    px: "20px",
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
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    mt={2}
                  >
                    <QueryBuilderOutlined
                      sx={{ fontSize: 12, color: "#ffffff80", mr: "3px" }}
                    />
                    <Typography color="#ffffff80" fontSize={12}>
                      {formattedTime}
                    </Typography>
                  </Box>
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
                    py: "12px",
                    px: "20px",
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
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={2}
                  >
                    <QueryBuilderOutlined
                      sx={{ fontSize: 12, color: "#ffffff80", mr: "3px" }}
                    />
                    <Typography color="#ffffff80" fontSize={12}>
                      {formattedTime}
                    </Typography>
                  </Box>
                </Box>
                {/* More icon for delete and copy */}
                <Box>
                  <IconButton
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={(e) =>
                      handleProfileMenuOpenBlue(e, message.message)
                    }
                    sx={{ color: "#7269ef", p: 0, mt: 2 }}
                  >
                    <MoreVert sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                {renderMenu}
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
        {/* diplay typing */}
        {isTyping &&
        fromUserId !== JSON.parse(localStorage.getItem("user") as string).id ? (
          <Box textAlign="left">
            <Box display="flex">
              <Box
                sx={{
                  ml: 7,
                  borderRadius: "8px 8px 8px 0",
                  mt: 2,
                  py: "12px",
                  px: "20px",
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
                <Box display="flex">
                  <Typography color="#eff2f7">typing</Typography>
                  <Box>
                    <Box
                      sx={{
                        animation: "wave 1.3s linear infinite",
                        bgcolor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        height: "4px",
                        marginRight: "-1px",
                        marginLeft: ".25rem",
                        opacity: ".6",
                        width: "4px",
                      }}
                    ></Box>
                    <Box
                      sx={{
                        animation: "wave 1.3s linear infinite",
                        bgcolor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        height: "4px",
                        marginLeft: ".25rem",
                        marginRight: "-1px",
                        opacity: ".6",
                        width: "4px",
                        animationDelay: "-1.1s",
                      }}
                    ></Box>
                    <Box
                      sx={{
                        animation: "wave 1.3s linear infinite",
                        bgcolor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        height: "4px",
                        marginLeft: ".25rem",
                        marginRight: "-1px",
                        opacity: ".6",
                        width: "4px",
                        animationDelay: "-.9s",
                      }}
                    ></Box>
                  </Box>
                </Box>
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
        ) : (
          <Box></Box>
        )}
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
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
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
