import React, { FC, useContext, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  CallOutlined,
  MoreHorizOutlined,
  Search,
  VideoCameraFrontOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import { styled } from "@mui/material/styles";
import ApiMessage from "../../Services/Message";
import { Message } from "../Common/Messenger";


const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const TopBarChat: FC<{
  setPusherMessages: (pusherMessage: Message[]) => void;
}> = ({ setPusherMessages }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // handle open modal  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // function delete conversation
  const handleOpenDeleteBox = () => {
    handleMenuClose();
    handleOpen();
  };

  const menuId = "primary-search-account-menu";
  // component menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleOpenDeleteBox}>Delete</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  // use context
  const { toUser } = useContext(ChatWithUserContext);

  // handle show message with user
  const { updateMessages } = useContext(ChatWithUserContext);
  const handleDeleteChat = () => {
    ApiMessage.deleteConversation(toUser.toUserId)
      .then((res) => {
        setPusherMessages([]);
        updateMessages([]);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Box
        sx={{ bgcolor: "inherit" }}
        display="flex"
        my={2}
        justifyContent="space-between"
        px={3}
      >
        <Box display="flex">
          <Avatar alt={toUser.toUserName} src={toUser.toUserAvatar} />
          <Typography ml={3} fontSize={16} color="#eff2f7" lineHeight={3}>
            {toUser.toUserName}
          </Typography>
        </Box>
        <Box>
          <IconButton sx={{ color: "#7a7f9a", mx: 1 }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: "#7a7f9a", mx: 1 }}>
            <CallOutlined />
          </IconButton>
          <IconButton sx={{ color: "#7a7f9a", mx: 1 }}>
            <VideoCameraFrontOutlined />
          </IconButton>
          <IconButton
            size="large"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#7a7f9a", ml: 2 }}
          >
            <MoreHorizOutlined />
          </IconButton>
        </Box>
        {renderMenu}
      </Box>
      <Divider sx={{ bgcolor: "#36404a" }} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Notice
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure to delete conversation?
          </Typography>
          <Box display="flex" justifyContent="space-between" pt={2}>
            <Button variant="contained" onClick={handleDeleteChat}>
              Delete
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TopBarChat;
