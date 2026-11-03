import { useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { retroPalette } from "../style/theme";
const base = import.meta.env.BASE_URL;
const collections = [
  { id: "color", name: "Color sin vueltas", image: `${base}personalizadas.jpg`, style: "Color", description: "Combinaciones que hacen de una alfombra el punto de partida de tu espacio." },
  { id: "retro", name: "Guiños de otra época", image: `${base}en-stock.jpg`, style: "Vintage", description: "Referencias vintage para combinar con objetos, muebles y recuerdos de hoy." },
  { id: "formas", name: "Fuera del rectángulo", image: `${base}detalles.jpg`, style: "Formas", description: "Curvas, geometrías y contornos para pensar una alfombra con otra forma." },
  { id: "propio", name: "La que imaginaste", image: `${base}patagonia.jpg`, style: "A medida", description: "Tu referencia, tus medidas y tus colores como punto de partida del diseño." },
];
export default function Colecciones() {
  const [filter, setFilter] = useState("Todas");
  return <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}><Container maxWidth="lg">
    <Stack spacing={2} alignItems="center" textAlign="center" mb={5}><Chip label="Universo Wavy" color="primary" /><Typography variant="h2" component="h1" sx={{ fontFamily: "'Archivo Black', sans-serif", fontSize: { xs: 38, md: 60 } }}>Alfombras con estilo propio</Typography><Typography color="text.secondary" sx={{ maxWidth: 680 }}>Una selección de ideas para encontrar el estilo de tu próxima alfombra. Explorá referencias de color, formas y diseño vintage.</Typography></Stack>
    <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap" mb={4}>{["Todas", "Color", "Vintage", "Formas", "A medida"].map(value => <Chip key={value} label={value} clickable component="button" aria-pressed={value === filter} onClick={() => setFilter(value)} color={value === filter ? "primary" : "default"} />)}</Stack>
    <Grid container spacing={4}>{collections.filter(item => filter === "Todas" || item.style === filter).map(item => <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}><Card sx={{ height: "100%", overflow: "hidden" }}><CardMedia component="img" height="230" image={item.image} alt={`Inspiración de alfombras: ${item.style.toLowerCase()}`} sx={{ objectFit: "cover", borderBottom: `2px solid ${retroPalette.border}` }} /><CardContent><Chip label={item.style} size="small" sx={{ mb: 2 }} /><Typography variant="h6" component="h2">{item.name}</Typography><Typography color="text.secondary" sx={{ my: 2, fontSize: 14 }}>{item.description}</Typography><Button fullWidth component={Link} to={item.id === "propio" ? "/personalizada" : "/shop"} variant="outlined">{item.id === "propio" ? "Diseñar mi alfombra" : "Explorar alfombras"}</Button></CardContent></Card></Grid>)}</Grid>
    <Box sx={{ mt: 7, p: { xs: 3, md: 5 }, bgcolor: retroPalette.red, color: retroPalette.paper, border: `3px solid ${retroPalette.border}`, boxShadow: "8px 8px 0 rgba(25,23,20,.2)", textAlign: "center" }}><Typography variant="h4" component="h2" gutterBottom>¿Tenés otra idea en mente?</Typography><Typography sx={{ mb: 3 }}>Contanos qué diseño, forma y colores imaginás. Empezamos por tu referencia.</Typography><Button component={Link} to="/personalizada" variant="contained" sx={{ bgcolor: retroPalette.paper, color: retroPalette.red, "&:hover": { bgcolor: retroPalette.cream } }}>Solicitar presupuesto</Button></Box>
  </Container></Box>;
}
