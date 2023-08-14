import { Avatar, Badge, Box, Button, Card, CardContent, InputBase, Stack, Typography } from "@mui/material";
import React, { FC, useContext, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import "../css/common.css";
import ApiUser from "../../Services/User";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import ApiMessage from "../../Services/Message";
import { Message } from "./Messenger";
import { ToUser } from "./ChatWithUserProvider";
import Pusher from "pusher-js";
import ApiAuth from "../../Services/Auth";
// style for search
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

// style for search icon
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  color: "#7a7f9a",
  justifyContent: "center",
}));

// style for input
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#add4d2",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#abb4d2", // Màu chữ của placeholder (đỏ)
    fontFamily: "Arial, sans-serif", // Font chữ của placeholder
  },
}));

// style for badge icon
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface UserDisplay extends ToUser {
  lastMessage: string;
}

const Chat: FC<{
  pusherMessages: Message[];
  setPusherMessages: (pusherMessage: Message[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}> = ({ pusherMessages, setPusherMessages, setIsLoading }) => {
  // state for users
  const [users, setUsers] = useState<UserDisplay[]>([]);

  // handle show message with user
  const { changeUser, updateMessages, updateConversationId } =
    useContext(ChatWithUserContext);

  // handle get list users
  const getListFriends = (firstTime: boolean) => {
    ApiUser.getAllUsers()
      .then((res) => {
        const userList = res.data.map((user: any)=>{
          return{
            toUserId : user.id,
            toUserName: user.name,
            toUserAvatar: user.avatar,
            lastMessage: user.lastMessage,
          }
        })
        setUsers(userList);
        if (firstTime) {
          // default value when open browser
          const toUser = {
            toUserId : res.data[0].id,
            toUserName: res.data[0].name,
            toUserAvatar: res.data[0].avatar,
          }
          changeUser(toUser);
          ApiMessage.getMessagesWithUser(res.data[0].id).then((res1) => {
            updateMessages(res1.data);
          });
          ApiMessage.getConversatiion(res.data[0].id).then((res1) => {
            updateConversationId(res1.data);
          });
          setFirstTime(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // call api get users
  const [firstTime, setFirstTime] = useState(true);
  useEffect(() => {
    getListFriends(firstTime);
  }, [pusherMessages]);

  // handle click change user conversation
  const handleShowMessage = (user: UserDisplay) => {
    setIsLoading(true);
    changeUser(user);
    // api get all messages with a user
    ApiMessage.getMessagesWithUser(user.toUserId)
      .then((res) => {
        updateMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // api get conversation id
    ApiMessage.getConversatiion(user.toUserId)
      .then((res) => {
        updateConversationId(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
    // message from pusher will be empty
    setPusherMessages([]);
  };

  // active users get from db
  const [activeUserIdDB, setActiveUserIdDB] = useState<number[]>([]);
  useEffect(() => {
    ApiAuth.getUserIdLogged()
      .then((res) => {
        res.data.map((item: any) =>
          setActiveUserIdDB((prev: number[]) => [...prev, item?.user_id_logged])
        );
      })
      .catch((err) => console.log(err));
  }, []);
  // use Pusher to display active user
  const [activeUserIdRealTime, setActiveUserIdRealTime] = useState<number[]>([]);
  var pusher = new Pusher("96e68ac1a93c911b481f", {
    cluster: "ap1",
  });
  // connect to pusher event user loggin 
  // Note: it just displays user who log in after you 
  var channel = pusher.subscribe("User-Logged");
  var channelLogout = pusher.subscribe("User-Logout");
  const handleActiveUser = (data: any) => {
    setActiveUserIdRealTime((prevUser: number[]) => [...prevUser, data.id]);
  };
  const handleUserLogout = (data:any) => {
    console.log(data);
    setActiveUserIdRealTime((prevUser: number[]) => prevUser.filter((value) => value !== data.id));
  }
  // get userId from pusher
  useEffect(() => {
    channel.bind("userlogged", handleActiveUser);
    channelLogout.bind("userlogout", handleUserLogout);
    return () => {
      channel.unbind("userlogged", handleActiveUser);
      channelLogout.bind("userlogout", handleUserLogout);
    };
  }, [channel, channelLogout]);
  return (
    <Stack spacing={2} pt={2}>
      <Box display="block" textAlign="left" px={3}>
        <Typography color="#eff2f7" variant="h5">
          Chats
        </Typography>
      </Box>
      {/* Search  */}
      <Box>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search messages or users"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>
      {/* friends active */}
      <Stack direction="row" spacing={2} px={3}>
        {users.map((user, index) => {
          const isActiveDB = activeUserIdDB.includes(user.toUserId);
          const isActiveRT = activeUserIdRealTime.includes(user.toUserId);
          return (
            <Card sx={{ bgcolor: "#ffffff26" }} key={index}>
              <CardContent>
                {(isActiveRT||isActiveDB) ? (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar alt={user.toUserName} src={user.toUserAvatar} />
                  </StyledBadge>
                ) : (
                  <Avatar alt={user.toUserName} src={user.toUserAvatar} />
                )}
                <Typography color="#eff2f7" fontSize={13} sx={{ mt: 1 }}>
                  {user.toUserName}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
      <Box textAlign="left" px={3}>
        <Typography color="#eff2f7">Recent</Typography>
      </Box>
      {/* Chats */}
      <Box
        maxHeight="50vh"
        height="100vh"
        px={3}
        overflow="auto"
        className="container"
      >
        {users.map((user, index) => {
          const isActiveDB = activeUserIdDB.includes(user.toUserId);
          const isActiveRT = activeUserIdRealTime.includes(user.toUserId);
          return (
            <Button key={index} onClick={() => handleShowMessage(user)} variant="text">
              <Stack direction="row">
                <CardContent>
                  {(isActiveRT||isActiveDB) ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar alt={user.toUserName} src={user.toUserAvatar} />
                    </StyledBadge>
                  ) : (
                    <Avatar alt={user.toUserName} src={user.toUserAvatar} />
                  )}
                </CardContent>
                <Box pt={2} width={250} textAlign="left">
                  <Typography
                    color="#eff2f7"
                    fontSize={15}
                    textTransform="none"
                  >
                    {user.toUserName}
                  </Typography>
                  <Typography
                    color="#add4d2"
                    fontSize={14}
                    textTransform="none"
                  >
                    {user.lastMessage}
                  </Typography>
                </Box>
                <Box pt={2}>
                  <Typography color="#add4d2" fontSize={11}>
                    1:02 Pm
                  </Typography>
                </Box>
              </Stack>
            </Button>
          );
        })}
      </Box>
    </Stack>
  );
};

export default Chat;
