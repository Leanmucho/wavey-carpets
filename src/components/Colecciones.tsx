import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { retroPalette } from "../style/theme";

const collections = [
  {
    id: "street",
    name: "Street Classics",
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80",
    price: "$199-$599",
    rating: 4.5,
    isNew: true,
    tags: ["Limited", "Handmade"],
  },
  {
    id: "boho",
    name: "Boho Garage",
    image: "https://images.unsplash.com/photo-1579639782539-15cc6c0be63f?auto=format&fit=crop&w=900&q=80",
    price: "$159-$449",
    rating: 4.2,
    isNew: false,
    tags: ["Eco", "Cotton"],
  },
  {
    id: "geometric",
    name: "Bowl Geometric",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=80",
    price: "$229-$699",
    rating: 4.8,
    isNew: true,
    tags: ["Wool", "Premium"],
  },
  {
    id: "trellis",
    name: "Vintage Trellis",
    image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=900&q=80",
    price: "$179-$549",
    rating: 4.3,
    isNew: false,
    tags: ["Retro", "Durable"],
  },
];

const filters = ["Todas", "Street", "Vintage", "Custom", "Limited"];

const Colecciones = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" textAlign="center" mb={6}>
          <Chip label="Series" color="primary" />
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontFamily: "'Archivo Black', 'Work Sans', sans-serif" }}
          >
            Colecciones
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            Familias de alfombras con graficas retro, textura artesanal y colores que se sienten de taller.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap mb={5}>
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              clickable
              color={filter === "Todas" ? "primary" : "default"}
              variant={filter === "Todas" ? "filled" : "outlined"}
            />
          ))}
        </Stack>

        <Grid container spacing={4}>
          {collections.map((collection) => (
            <Grid key={collection.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%", overflow: "hidden", position: "relative" }}>
                {collection.isNew && (
                  <Chip
                    label="Nuevo"
                    color="secondary"
                    sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
                  />
                )}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="230"
                    image={collection.image}
                    alt={collection.name}
                    sx={{ objectFit: "cover", borderBottom: `2px solid ${retroPalette.border}` }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: retroPalette.paper,
                      "&:hover": { bgcolor: retroPalette.paper },
                    }}
                    onClick={() => toggleFavorite(collection.id)}
                    aria-label="Favorito"
                  >
                    {favorites.includes(collection.id) ? (
                      <Favorite sx={{ color: retroPalette.red }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>

                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" gap={1}>
                    <Typography variant="h6">{collection.name}</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Star sx={{ color: retroPalette.mustard, fontSize: 18 }} />
                      <Typography variant="body2">{collection.rating}</Typography>
                    </Stack>
                  </Stack>
                  <Typography color="text.secondary" sx={{ my: 1 }}>
                    {collection.price}
                  </Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap" mb={2}>
                    {collection.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                  <Button fullWidth variant="outlined" onClick={() => navigate("/shop")}>
                    Ver productos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            p: { xs: 3, md: 5 },
            bgcolor: retroPalette.red,
            color: retroPalette.paper,
            border: `3px solid ${retroPalette.border}`,
            boxShadow: "10px 10px 0 rgba(25,23,20,0.2)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Buscas algo personalizado?
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Podemos armar una pieza a medida con paleta, dibujo y tamano propio.
          </Typography>
          <Button variant="contained" sx={{ bgcolor: retroPalette.paper, color: retroPalette.red }}>
            Solicitar presupuesto
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Colecciones;
