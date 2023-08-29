import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import ApiUser from "../../Services/User";
import { ToUser } from "./ChatWithUserProvider";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import ApiMessage from "../../Services/Message";

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

// style for search input
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

const Contact = () => {
  const [listUsers, setListUsers] = useState<ToUser[]>([]);

  useEffect(() => {
    handleGetListContact();
  }, []);

  const handleGetListContact = () => {
    ApiUser.getAllUsers()
      .then((res) => {
        const list = res.data.map((user: any) => {
          return {
            toUserId: user?.id,
            toUserName: user?.name,
            toUserAvatar: user?.avatar,
          };
        });
        setListUsers(list);
      })
      .catch((err) => console.log(err));
  };
  // handle click change user conversation
  // handle show message with user
  const { changeUser, updateMessages, updateConversationId } =
    useContext(ChatWithUserContext);

  const handleShowMessage = (user: ToUser) => {
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
    // message from pusher will be empty
    // setPusherMessages([]);
  };
  return (
    <Stack spacing={2} pt={2}>
      <Box display="block" textAlign="left" px={3}>
        <Typography color="#eff2f7" variant="h5">
          Contacts
        </Typography>
      </Box>
      {/* Search  */}
      <Box>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search users"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>
      {/* get contacts */}
      <Box
        maxHeight="80vh"
        height="100vh"
        overflow="auto"
        className="container"
      >
        {listUsers.map((user, index) => {
          return (
            <Button
              key={index}
              onClick={() => handleShowMessage(user)}
              variant="text"
            >
              <Box display='flex' alignItems='center'>
                <CardContent>
                  <Avatar alt={user.toUserName} src={user.toUserAvatar} />
                </CardContent>
                <Box width={250} textAlign="left">
                  <Typography
                    color="#eff2f7"
                    fontSize={15}
                    textTransform="none"
                  >
                    {user.toUserName}
                  </Typography>
                </Box>
              </Box>
            </Button>
          );
        })}
      </Box>
    </Stack>
  );
};

export default Contact;
