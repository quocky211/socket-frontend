import {
  InsertLinkOutlined,
  InsertPhotoOutlined,
  Send,
  SentimentSatisfiedOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, TextField } from "@mui/material";
import React from "react";

const FooterChat = () => {
  return (
    <>
      <Divider sx={{ bgcolor: "#36404a" }} />
      <Box display="flex" p={2}>
        <TextField
          fullWidth
          placeholder="Enter message"
          sx={{
            bgcolor: "#ffffff26",
            borderRadius: 2,
            color: "#abb4d2",
            "& .MuiInputBase-input::placeholder": {
              color: "#abb4d2", // Màu chữ của placeholder (đỏ)
              fontFamily: "Arial, sans-serif", // Font chữ của placeholder
            },
          }}
        />
        <IconButton sx={{ color: "#7a7f9a" }}>
          <SentimentSatisfiedOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <InsertLinkOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <InsertPhotoOutlined />
        </IconButton>
        <IconButton sx={{ color: "#7a7f9a" }}>
          <Send />
        </IconButton>
      </Box>
    </>
  );
};

export default FooterChat;
