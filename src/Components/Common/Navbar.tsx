import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Auth from "../../Services/Auth";
import { useNavigate } from "react-router-dom";
import {
  Chat,
  Group,
  Logout,
  Person,
  Settings,
  WbSunny,
} from "@mui/icons-material";
import { NotificationMessageContext } from "./NotificationProvider";
import { useContext, useEffect } from "react";
import { FeatureContext } from "./FeatureProvider";
import Pusher from "pusher-js";

/**
 * interface Notification
 * @param {number} from_user_id
 * @param {string} body
 */
export interface NotiMessage {
  from_user_id: number;
  body: string;
}

const NavBar = () => {

  const navigate = useNavigate();

  // use context
  const { theNuNotification, updateNumber, updateNotifications } = useContext(
    NotificationMessageContext
  );
  const { change } = useContext(FeatureContext);

  // use Pusher
  var pusher = new Pusher("96e68ac1a93c911b481f", {
    cluster: "ap1",
  });

  // connect to pusher event 'chat'
  var channel = pusher.subscribe(
    "Notification-User-" + JSON.parse(localStorage.getItem("user") as string).id
  );
  var i = 0;
  const handleNewNotification = (data: NotiMessage) => {
    console.log(data);
    if (
      data.from_user_id !==
      JSON.parse(localStorage.getItem("user") as string).id
    ) {
      i++;
    }
    updateNumber(i);
    updateNotifications(data);
  };

  useEffect(() => {
    channel.bind("notification", handleNewNotification);
    return () => {
      channel.unbind("notification", handleNewNotification);
    };
  }, [channel]);

  // handle logout
  const handleLogout = () => {
    Auth.logout()
      .then((res) => {
        // delete accessToken on cookie
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // delete user on localStorage
        localStorage.removeItem("user");
        // navigate to login page
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });

  };

  const handleNotification = (feature: string) => {
    change(feature);
    updateNumber(0);
  };
  return (
    <Box sx={{ bgcolor: "inherit" }}>
      <Box pt={4} display="grid">
        <IconButton
          size="large"
          color="inherit"
          sx={{ my: 1 }}
          onClick={() => handleNotification("chat")}
        >
          <Chat fontSize="large" sx={{ color: "#abb4d2" }} />
        </IconButton>
        <IconButton size="large" color="inherit" sx={{ my: 1 }}>
          <Group fontSize="large" sx={{ color: "#abb4d2" }} />
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          sx={{ my: 1 }}
          onClick={() => handleNotification("notification")}
        >
          <Badge badgeContent={theNuNotification} color="error">
            <NotificationsIcon fontSize="large" sx={{ color: "#abb4d2" }} />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          sx={{ my: 1 }}
          onClick={() => handleNotification("setting")}
        >
          <Settings fontSize="large" sx={{ color: "#abb4d2" }} />
        </IconButton>
        <IconButton size="large" color="inherit" sx={{ my: 1 }}>
          <WbSunny fontSize="large" sx={{ color: "#abb4d2" }} />
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          onClick={() => handleNotification("setting")}
        >
          <AccountCircle fontSize="large" sx={{ color: "#abb4d2" }} />
        </IconButton>
        <IconButton size="large" color="inherit" sx={{ my: 1 }} onClick={handleLogout}>
          <Logout fontSize="large" sx={{ color: "#abb4d2" }} />
        </IconButton>
      </Box>
    </Box>
  );
};
export default NavBar;
