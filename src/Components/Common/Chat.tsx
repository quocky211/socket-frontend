import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import "./common.css";

// style for search 
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

// style for search icon 
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  color: "#7a7f9a",
  justifyContent: "center",
}));

// style for input 
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#add4d2",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#abb4d2", // Màu chữ của placeholder (đỏ)
    fontFamily: "Arial, sans-serif", // Font chữ của placeholder
  },
}));

// style for badge icon
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
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

const Chat = () => {
  return (
    <Stack spacing={2} pt={2}>
      <Box display="block" textAlign="left" px={3}>
        <Typography color="#eff2f7" variant="h5">
          Chats
        </Typography>
      </Box>
      {/* Search  */}
      <Box>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search messages or users"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>
      {/* friends active */}
      <Stack direction="row" spacing={2} px={3}>
        <Card sx={{ bgcolor: "#ffffff26" }}>
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
            <Typography color="#eff2f7" fontSize={13}>
              Erik
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "#ffffff26" }}>
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
            <Typography color="#eff2f7" fontSize={13}>
              Erik
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "#ffffff26" }}>
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
            <Typography color="#eff2f7" fontSize={13}>
              Erik
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "#ffffff26" }}>
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
            <Typography color="#eff2f7" fontSize={13}>
              Erik
            </Typography>
          </CardContent>
        </Card>
      </Stack>
      <Box textAlign="left" px={3}>
        <Typography color="#eff2f7">Recent</Typography>
      </Box>
      {/* Chats */}
      <Box maxHeight="50vh" height="100vh" px={3} overflow="auto" className="container">
        <Stack direction="row">
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
          </CardContent>
          <Box pt={2} width={300} textAlign="left">
            <Typography color="#eff2f7" fontSize={15}>
              Erik
            </Typography>
            <Typography color="#add4d2" fontSize={14}>
              Hehehehehehehehe...
            </Typography>
          </Box>
          <Box pt={2}>
            <Typography color="#add4d2" fontSize={11}>
              1:02 Pm
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
          </CardContent>
          <Box pt={2} width={300} textAlign="left">
            <Typography color="#eff2f7" fontSize={15}>
              Erik
            </Typography>
            <Typography color="#add4d2" fontSize={14}>
              Hehehehehehehehe...
            </Typography>
          </Box>
          <Box pt={2}>
            <Typography color="#add4d2" fontSize={11}>
              1:02 Pm
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
          </CardContent>
          <Box pt={2} width={300} textAlign="left">
            <Typography color="#eff2f7" fontSize={15}>
              Erik
            </Typography>
            <Typography color="#add4d2" fontSize={14}>
              Hehehehehehehehe...
            </Typography>
          </Box>
          <Box pt={2}>
            <Typography color="#add4d2" fontSize={11}>
              1:02 Pm
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
          </CardContent>
          <Box pt={2} width={300} textAlign="left">
            <Typography color="#eff2f7" fontSize={15}>
              Erik
            </Typography>
            <Typography color="#add4d2" fontSize={14}>
              Hehehehehehehehe...
            </Typography>
          </Box>
          <Box pt={2}>
            <Typography color="#add4d2" fontSize={11}>
              1:02 Pm
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
          </CardContent>
          <Box pt={2} width={300} textAlign="left">
            <Typography color="#eff2f7" fontSize={15}>
              Erik
            </Typography>
            <Typography color="#add4d2" fontSize={14}>
              Hehehehehehehehe...
            </Typography>
          </Box>
          <Box pt={2}>
            <Typography color="#add4d2" fontSize={11}>
              1:02 Pm
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <CardContent>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw0IwMnn2RIVUejhe-NG2jMr&ust=1690543212448000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICSgK_iroADFQAAAAAdAAAAABAR"
              />
            </StyledBadge>
          </CardContent>
          <Box pt={2} width={300} textAlign="left">
            <Typography color="#eff2f7" fontSize={15}>
              Erik
            </Typography>
            <Typography color="#add4d2" fontSize={14}>
              Hehehehehehehehe...
            </Typography>
          </Box>
          <Box pt={2}>
            <Typography color="#add4d2" fontSize={11}>
              1:02 Pm
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Chat;
