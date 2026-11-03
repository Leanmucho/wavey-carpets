import { Box, Container, Grid, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { retroPalette } from "../style/theme";

export default function FooterPage() {
  return <Box component="footer" sx={{ bgcolor: retroPalette.ink, color: retroPalette.paper, borderTop: `5px solid ${retroPalette.red}`, py: 6 }}>
    <Container maxWidth="lg"><Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 5 }}><Typography variant="h5" sx={{ color: retroPalette.mustard }} gutterBottom>Wavy Carpets</Typography><Typography sx={{ maxWidth: 360 }}>Alfombras hechas a mano, diseño propio y espíritu vintage. Piezas para que tu espacio cuente algo de vos.</Typography></Grid>
      <Grid size={{ xs: 6, md: 3 }}><Typography variant="h6" sx={{ color: retroPalette.mustard }} gutterBottom>Elegí tu camino</Typography><Stack spacing={1}><Link component={RouterLink} to="/shop" color="inherit">Ver alfombras</Link><Link component={RouterLink} to="/personalizada" color="inherit">Pedir una personalizada</Link><Link component={RouterLink} to="/colecciones" color="inherit">Explorar estilos</Link></Stack></Grid>
      <Grid size={{ xs: 6, md: 4 }}><Typography variant="h6" sx={{ color: retroPalette.mustard }} gutterBottom>Del taller a tu casa</Typography><Typography>Tufting artesanal.</Typography><Typography>Bariloche, Argentina.</Typography><Link component={RouterLink} to="/info" color="inherit" sx={{ display: 'inline-block', mt: 2 }}>Conocé cómo trabajamos ↗</Link></Grid>
    </Grid><Typography variant="body2" sx={{ mt: 5, color: "rgba(255,248,236,0.75)" }}>© {new Date().getFullYear()} Wavy Carpets. Todos los derechos reservados.</Typography></Container>
  </Box>;
}
