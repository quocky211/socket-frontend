import React, { FC, useContext, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  CallOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHorizOutlined,
  Search,
  VideoCameraFrontOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  InputBase,
  Modal,
  Popover,
  Typography,
  alpha,
} from "@mui/material";
import { ChatWithUserContext } from "./ChatWithUserProvider";
import { styled } from "@mui/material/styles";
import ApiMessage from "../../Services/Message";
import { Message } from "../Common/Messenger";
import '../css/common.css';
import {useStyles} from "./Messenger";
// style for modal 
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

// style for search
const SearchForm = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

// style for search input
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#add4d2",
  "& .MuiInputBase-input": {
    padding: '8px 16px',
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

const TopBarChat: FC<{
  setPusherMessages: (pusherMessage: Message[]) => void,
  scrollToMessage: (messageId: number) =>void,
}> = ({ setPusherMessages, scrollToMessage}) => {
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
  const classes: any = useStyles();

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
      classes={{ paper: classes.menuPaper }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem sx={{color:'#a6b0cf', fontSize:16}} onClick={handleOpenDeleteBox}>Delete</MenuItem>
      <MenuItem sx={{color:'#a6b0cf', fontSize:16}} onClick={handleMenuClose}>Logout</MenuItem>
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

  // search
  const [anchorElSearch, setAnchorElSearch] = useState<HTMLButtonElement | null>(null);
  const [countSearch, setCountSearch] = useState(0);
  const [searchMessages, setSearchMessages] = useState<Message[]>([]);
  const [indexSearch, setIndexSearch] = useState(0);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElSearch(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setAnchorElSearch(null);
  };

  const openSearch = Boolean(anchorElSearch);
  const id = openSearch ? "simple-popover" : undefined;

  const handleUpSearch = () =>{
    if(indexSearch<countSearch)
    { 
      setIndexSearch((prev)=>{
        console.log(prev);
        console.log(searchMessages);
        scrollToMessage(searchMessages[prev].id)
        return prev+1;
      });
    }
  }

  const handleDownSearch = () =>{
    if(indexSearch > 1)
    {
      setIndexSearch((prev)=>{
        scrollToMessage(searchMessages[prev-2].id)
        return prev-1;
      });
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndexSearch(0);
    setCountSearch(0);
    const inputElement = event.target as HTMLInputElement;
    ApiMessage.searchChat(toUser.toUserId,inputElement.value)
    .then((res)=>{
      setCountSearch(res.data.count);
      const chats = res.data.results.sort((a:any, b:any) => b.id - a.id);
      console.log(chats);
      setSearchMessages(chats);
      setIndexSearch(1);
      scrollToMessage(chats.id);
    })
    .catch((err)=>console.log(err));
  }

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
          <IconButton
            sx={{ color: "#7a7f9a", mx: 1 }}
            aria-describedby={id}
            onClick={handleClick}
          >
            <Search />
          </IconButton>
          {/* search form */}
          <Popover
            id={id}
            open={openSearch}
            anchorEl={anchorElSearch}
            onClose={handleCloseSearch}
            classes={{ paper: classes.menuPaper }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box p={1} bgcolor="#303841" display='flex' alignItems='center'>
              <SearchForm>
                <StyledInputBase
                  placeholder="Search.."
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearch}
                />
              </SearchForm>
              {/* <Button variant="text" sx={{ml:2}} onClick={handleSearch}>Search</Button> */}
              <Typography sx={{mx:2}} color='#eff2f7'>{indexSearch}/{countSearch}</Typography>
              <IconButton onClick={handleUpSearch} sx={{p:0, color:'#abb4d2', borderRadius:'50%', bgcolor:'#ffffff26'}}>
                <KeyboardArrowUp sx={{fontSize:18}}/>
              </IconButton>
              <IconButton onClick={handleDownSearch} sx={{p:0, ml:1, color:'#abb4d2', borderRadius:'50%', bgcolor:'#ffffff26'}}>
                <KeyboardArrowDown sx={{fontSize:18}}/>
              </IconButton>
            </Box>
          </Popover>
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
