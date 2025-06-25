import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { authService } from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.register(formData);

      if (response.data.success) {
        toast.success(
          "🎉 Thanks for being a part of Jetstream! Please Login Now",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 4,
            bgcolor: "secondary.main",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
              mb: 4,
              color: "text.primary",
              fontWeight: "bold",
            }}
          >
            Register
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: "primary.main" }}>
                  Choose Role
                </InputLabel>
                <Select
                  name="role"
                  type="select"
                  value={formData.role}
                  onChange={handleChange}
                  label="Choose Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Already have an account? Login
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "medium",
                }}
              >
                Register
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
