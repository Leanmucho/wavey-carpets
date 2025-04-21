import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>Iniciar Sesión</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            fullWidth
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
