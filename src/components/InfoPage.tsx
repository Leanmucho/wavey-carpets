import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import img1 from "../assets/personalizadas.jpg";
import img2 from "../assets/en-stock.jpg";
import img3 from "../assets/detalles.jpg";
import img4 from "../assets/patagonia.jpg";
import FooterPage from "./FooterPage"; // Importa el Footer

const InfoPage = () => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "#F0E6D2",
        pt: { xs: 10, md: 12 }, // Separación desde el top (evita solaparse con header)
        px: { xs: 2, md: 6 },
        pb: 6,
        color: "#1A1A1A",
        textAlign: "center", // centra todo por defecto
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h3"
        component="h1"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#4F772D" }}
      >
        Nosotros
      </Typography>

      {/* Intro */}
      <Typography
        variant="body1"
        component="p"
        maxWidth="800px"
        margin="auto"
        sx={{ mb: 6 }}
      >
        Somos una marca especializada en la fabricación de alfombras. Cada diseño es único e irrepetible.
        Creamos desde cero, usando más de 100 diseños base y técnicas de tufting. Apostamos por colores vibrantes
        y combinaciones atrevidas para transformar tu espacio.
      </Typography>

      {/* Primer bloque de imágenes */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <motion.img
            src={img1}
            alt="Alfombras personalizadas"
            style={{ width: "100%", borderRadius: "16px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.img
            src={img2}
            alt="Alfombras en stock"
            style={{ width: "100%", borderRadius: "16px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </Grid>
      </Grid>

      {/* Detalles */}
      <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{ color: "#D62246", mb: 2 }}
          >
            Detalles
          </Typography>
          <Typography variant="body1" maxWidth="600px" margin="auto">
            Para nosotras, el reverso es tan importante como el diseño: garantiza una alfombra duradera y de calidad.
            Usamos materiales premium y técnicas que respetan el diseño y el confort.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
          <motion.img
            src={img3}
            alt="Detalles de las alfombras"
            style={{ width: "100%", borderRadius: "16px", marginTop: "20px" }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          />
        </Grid>
      </Grid>

      {/* Patagonia */}
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <motion.img
            src={img4}
            alt="Taller en la Patagonia"
            style={{ width: "100%", borderRadius: "16px" }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{ color: "#D62246", mb: 2 }}
          >
            Desde la Patagonia
          </Typography>
          <Typography variant="body1" maxWidth="600px" margin="auto">
            Nuestro taller está en Bariloche. Nos inspira la calma de la naturaleza y la fuerza del sur para crear
            piezas únicas con pasión y dedicación artesanal.
          </Typography>
        </Grid>
      </Grid>

      {/* Footer */}
      <FooterPage /> {/* Aquí agregas el Footer */}
    </Box>
  );
};

export default InfoPage;
