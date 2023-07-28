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
import { Chat, Group, Person, Settings, WbSunny } from "@mui/icons-material";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  // Menu of account
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
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ bgcolor: "inherit" }}>
      <Box pt={4}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <Chat fontSize='large'/>
          </Badge>
        </IconButton>
        <IconButton size="large" color="inherit">
          <Group fontSize='large'/>
        </IconButton>
        <IconButton size="large" color="inherit">
          <Person fontSize='large'/>
        </IconButton> 
        <IconButton size="large" color="inherit">
          <WbSunny fontSize='large'/>
        </IconButton> 
        <IconButton size="large" color="inherit">
          <Settings fontSize='large'/>
        </IconButton>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon fontSize='large'/>
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle fontSize='large'/>
        </IconButton>
      </Box>
      {renderMenu}
    </Box>
  );
}
