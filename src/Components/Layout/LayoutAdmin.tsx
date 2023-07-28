import { FC, ReactNode } from "react";
import ButtonAppBar from "../Common/Topbar";
import { Box, Paper } from "@mui/material";

const LayoutAdmin: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box>
      {/* Top bar */}
      <ButtonAppBar />
      {/* Main  */}
      <Paper sx={{p:2, height:'100%'}}>
        {children}
        </Paper>
    </Box>
  );
};

export default LayoutAdmin;
