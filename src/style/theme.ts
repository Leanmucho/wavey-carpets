import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D62246", // Rojo oscuro vintage
    },
    secondary: {
      main: "#4F772D", // Verde militar
    },
    background: {
      default: "#F0E6D2", // Beige claro
      paper: "#FFFFFF", // Blanco para contraste
    },
    text: {
      primary: "#1A1A1A", // Negro mate
      secondary: "#FFD166", // Amarillo mostaza
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h1: { fontWeight: "bold" },
    h2: { fontWeight: "bold" },
  },
});

export default theme;
