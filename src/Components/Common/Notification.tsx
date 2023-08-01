import React, { useContext } from "react";
import { NotificationMessageContext } from "./NotificationProvider";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { NotiMessage } from "./Navbar";
import './common.css';
const Notification = () => {
  // get state from use context
  const { notifications } = useContext(NotificationMessageContext);

  return (
    <Box p={3}>
      <Box display="block" textAlign="left">
        <Typography color="#eff2f7" variant="h5">
          Notifications
        </Typography>
      </Box>
      {/* get notifications */}
      <Box maxHeight="80vh"
        height="100vh"
        overflow="auto"
        className="container">
        {notifications.map((notification: NotiMessage) => {
          const isCurrentUser =
            notification.from_user_id ===
            JSON.parse(localStorage.getItem("user") as string).id;
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
                  {notification.body}
                </Typography>
              </Stack>
            </Box>
          );
          return messageBox;
        })}
      </Box>
    </Box>
  );
};
export default Notification;
