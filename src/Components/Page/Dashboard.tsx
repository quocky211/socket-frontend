import { useState, useEffect } from "react";
import LayoutAdmin from "../Layout/LayoutAdmin";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import ApiUser from "../../Services/User";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * interface User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */
interface User {
  id: number;
  name: string;
  email: string;
}

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

/**
 * validate for input field
 */
const validateSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().required().email(),
  password: Yup.string().required(),
});

const Dashboard = () => {
  // state for list users
  const [users, setUsers] = useState<User[]>([]);

  // open and close modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // useForm and Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validateSchema),
  });

  // call api and get users
  useEffect(() => {
      getUsers();
  }, [users]);

  // handle get api users
  const getUsers = () => {
    ApiUser.getAllUsers().then((res) => {
      setUsers(res.data);
    });
  };
  
  // colums for table
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 300,
    },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {/* button edit */}
            <Button onClick={handleOpen}>
                <Edit />
            </Button>
            {/* button delete */}
            <Button onClick={()=>handleDeleteUser(params.row.id)}>
              <DeleteOutline color="error"/>
            </Button>
          </>
        );
      },
    },
  ];

  // handle create user
  const onSubmit = (data: any) => {
    ApiUser.storeUser(data)
    .then((res)=>{
      handleClose();
    })
    .catch((err)=>{
      console.log(err);
    })
  };

  // handele delete user
  const handleDeleteUser = (id: number)=>{
    ApiUser.deleteUser(id)
    .then((res)=>{
      alert('Deleted')
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  return (
    <LayoutAdmin>
      <Box height={800} width="100%">
        {/* Button create user */}
        <Button
          variant="contained"
          sx={{ display: "block", mb: 2 }}
          onClick={handleOpen}
        >
          Create
        </Button>
        {/* Table */}
        <DataGrid
          rows={users}
          getRowId={(row: any) => row.id}
          disableRowSelectionOnClick
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
        />
        {/* Modal for create user */}
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography variant="h6" component="h2">
                Add user
              </Typography>
              <Box sx={{ mt: 2 }}>
                {/* name input */}
                <TextField
                  margin="normal"
                  fullWidth
                  label="Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                />
                {/* email input */}
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                />
                {/* password input */}
                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                {/* button submit */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit(onSubmit, (e: any) => {
                    console.log(e);
                  })}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </LayoutAdmin>
  );
};

export default Dashboard;
