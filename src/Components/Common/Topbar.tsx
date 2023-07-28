import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Auth from "../../Services/Auth";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar() {

  const navigate = useNavigate();

  // handle logout
  const logout = () => {
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
      .catch((err) => console.log(err));
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
