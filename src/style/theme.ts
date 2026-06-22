import { createTheme } from "@mui/material/styles";

export const retroPalette = {
  cream: "#EFE4D0",
  paper: "#FFF8EC",
  ink: "#191714",
  mutedInk: "#5E574D",
  red: "#D62246",
  redDark: "#A91532",
  olive: "#4F772D",
  mustard: "#E5B83E",
  blue: "#1D70B8",
  border: "#24201A",
};

const theme = createTheme({
  palette: {
    primary: {
      main: retroPalette.red,
      dark: retroPalette.redDark,
    },
    secondary: {
      main: retroPalette.olive,
    },
    warning: {
      main: retroPalette.mustard,
    },
    background: {
      default: retroPalette.cream,
      paper: retroPalette.paper,
    },
    text: {
      primary: retroPalette.ink,
      secondary: retroPalette.mutedInk,
    },
  },
  typography: {
    fontFamily: "'Work Sans', 'Trebuchet MS', Arial, sans-serif",
    h1: { fontWeight: 900, letterSpacing: 0, textTransform: "uppercase" },
    h2: { fontWeight: 900, letterSpacing: 0, textTransform: "uppercase" },
    h3: { fontWeight: 900, letterSpacing: 0 },
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 800, letterSpacing: 0 },
    button: { fontWeight: 900, letterSpacing: 0, textTransform: "uppercase" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: retroPalette.cream,
          color: retroPalette.ink,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: "3px 3px 0 #191714",
          border: `2px solid ${retroPalette.border}`,
          transition: "transform 160ms ease, box-shadow 160ms ease",
          "&:hover": {
            transform: "translate(-1px, -1px)",
            boxShadow: "5px 5px 0 #191714",
          },
        },
        contained: {
          color: retroPalette.paper,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `2px solid ${retroPalette.border}`,
          borderRadius: 8,
          boxShadow: "6px 6px 0 rgba(25, 23, 20, 0.22)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 3px 0 rgba(25, 23, 20, 0.25)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 800,
        },
      },
    },
  },
});

export default theme;
