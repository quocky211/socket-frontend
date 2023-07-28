import {
  Alert,
  AlertColor,
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Auth from "../../Services/Auth";
import { useNavigate } from "react-router-dom";

/**
 * validate for input field
 */
const validateSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
});

const Login = () => {
  // useForm and Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validateSchema),
  });

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isLoading, setLoading] = useState(false);
  // Hàm để lưu token vào cookie
  const setCookie = (name: string, value: string) => {
    const cookieValue = encodeURIComponent(value);
    document.cookie = `${name}=${cookieValue}; path=/`;
  };

  // function onclick -> login
  const onSubmit = (data: any) => {
    setLoading(true);
    Auth.login(data)
      .then((res) => {
        if (res.data && res.data.token) {
          setCookie("accessToken", res.data.token);
          setSeverity("success");
          setMessage("Login success");
          setIsLogin(true);
          setLoading(false);
          if (res.data.user.role === "user") {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("home");
          } else {
            localStorage.setItem("admin", JSON.stringify(res.data.user));
            navigate("dashboard");
          }
        } else {
          setMessage("Unauthorized");
        }
      })
      .catch((err) => {
        setIsLogin(true);
        setSeverity("error");
        setMessage("Email or Password is incorrect");
        setLoading(false);
      });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLoading ? <CircularProgress /> : ""}
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {isLogin ? (
            <Alert severity={severity as AlertColor} sx={{ mt: 2 }}>
              {message}
            </Alert>
          ) : (
            " "
          )}
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors?.email?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit(onSubmit, (e: any) => {
                console.log(e);
              })}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs textAlign="left">
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
