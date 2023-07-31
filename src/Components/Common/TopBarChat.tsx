import React from "react";
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
import { Avatar, Divider, Typography } from "@mui/material";

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
          <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
          />
          <Typography ml={3} fontSize={16} color="#eff2f7" lineHeight={3}>
            {JSON.parse(localStorage.getItem("user") as string).name}
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
