import React, { useContext } from "react";
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
import { Avatar, Badge, Divider, Typography } from "@mui/material";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    bottom:"32%",
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

const TopBarChat = () => {
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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  // use context
  const { toUser } = useContext(ChatWithUserContext);

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
        <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
          <Avatar
            alt={toUser.toUserName}
            src={toUser.toUserAvatar}
            />
            </StyledBadge>
          <Typography ml={3} fontSize={16} color="#eff2f7" lineHeight={3}>
            {toUser.toUserName}
          </Typography>
        </Box>
        <Box>
          <IconButton sx={{ color: "#7a7f9a" }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: "#7a7f9a" }}>
            <CallOutlined />
          </IconButton>
          <IconButton sx={{ color: "#7a7f9a" }}>
            <VideoCameraFrontOutlined />
          </IconButton>
          <IconButton
            size="large"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#7a7f9a" }}
          >
            <MoreHorizOutlined />
          </IconButton>
        </Box>
        {renderMenu}
      </Box>
      <Divider sx={{ bgcolor: "#36404a" }} />
    </>
  );
};

export default TopBarChat;
