import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { retroPalette } from "../../style/theme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch {
      setError("No pudimos iniciar sesion con esos datos.");
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "78vh",
        pt: { xs: 14, md: 16 },
        px: 2,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "min(440px, 100%)",
          p: { xs: 3, md: 4 },
          border: `3px solid ${retroPalette.border}`,
          boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
          bgcolor: retroPalette.paper,
        }}
      >
        <Stack spacing={2.5} component="form" onSubmit={handleLogin}>
          <Box>
            <Typography variant="h3" component="h1">
              Login
            </Typography>
            <Typography color="text.secondary">Entra para seguir tu carrito y pedidos.</Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Contrasena"
            fullWidth
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" variant="contained" size="large">
            Ingresar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
