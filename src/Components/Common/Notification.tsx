import React, { useContext } from "react";
import { NotificationMessageContext } from "./NotificationProvider";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Message } from "./Messenger";


const Notification = () => {
  // get state from use context
  const { messages } = useContext(NotificationMessageContext);

  return (
    <Box p={3}>
      <Box display="block" textAlign="left">
        <Typography color="#eff2f7" variant="h5">
          Notifications
        </Typography>
      </Box>
      {/* get notifications */}
      {messages.map((message: Message) => {
        const isCurrentUser =
          message.username ===
          JSON.parse(localStorage.getItem("user") as string).name;
        const messageBox = isCurrentUser ? (
          <Box></Box>
        ) : (
          <Box p={2} mt={2} bgcolor="#262e35" borderRadius={2}>
            <Stack direction="row">
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
              <Typography
                color="#eff2f7"
                fontSize={15}
                lineHeight={3}
                sx={{ ml: 3, mr: 1 }}
              >
                {message.username}
              </Typography>
              <Typography color="#add4d2" fontSize={15} lineHeight={3}>
                vừa nhắn tin cho bạn.
              </Typography>
            </Stack>
          </Box>
        );
        return messageBox;
      })}
    </Box>
  );
};
export default Notification;
