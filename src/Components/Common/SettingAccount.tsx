import { ModeEdit } from "@mui/icons-material";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import ApiUser from "../../Services/User";
import Auth from "../../Services/Auth";
import { useNavigate } from "react-router-dom";

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

const SettingAccount = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  // state for avatar
  const [image, setImage] = useState<File | null>(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  // image click
  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };
  // image value
  const handleImageChange = () => {
    const selectedImage = imageInputRef.current?.files?.[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
    handleOpen();
  };

  const user = JSON.parse(localStorage.getItem("user") as string);

  const handleChangeAvatar = () => {
    const data = {
      avatar: image,
    };
    ApiUser.updateAvatar(data, user.id)
      .then((res) => {
        Auth.logout()
          .then((res1) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
  };
  return (
    <Box p={3}>
      <Box display="block" textAlign="left">
        <Typography color="#eff2f7" variant="h5">
          Settings
        </Typography>
      </Box>
      {/* get account */}
      <Box>
        <Box
          display="inline-block"
          textAlign="center"
          mt={5}
          position="relative"
        >
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{ width: 100, height: 100 }}
          />
          <Avatar
            onClick={handleImageButtonClick}
            sx={{
              bgcolor: "#36404a",
              width: 30,
              height: 30,
              position: "absolute",
              bottom: 0,
              right: 2,
              cursor: "pointer",
            }}
          >
            <ModeEdit sx={{ color: "#ffffff", fontSize: 18 }} />
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Avatar>
        </Box>
        <Box
          maxHeight="80vh"
          height="100vh"
          overflow="auto"
          className="container"
        >
          <Typography color="#eff2f7" m={2}>
            {user.name}
          </Typography>
          <Typography color="#abb4d2">{user.email}</Typography>
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Note
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          You are changing your avatar. After finishing, you will need to log out to refresh the avatar. Would you like to continue?
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button color="error" variant="contained" onClick={handleClose}>
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleChangeAvatar}
            >
              {" "}
              OK{" "}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SettingAccount;
