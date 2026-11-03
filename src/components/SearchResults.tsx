import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { retroPalette } from "../style/theme";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const searchTerm = query.get("q")?.trim() ?? "";
  const normalizedSearch = searchTerm.toLowerCase();
  const results = products.filter((product) =>
    [product.name, product.description, product.materials.join(" "), product.tags?.join(" ") ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
  );

  return (
    <Box component="main" sx={{ minHeight: "80vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom>
          Buscá tu alfombra
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Resultados para "{searchTerm}"
        </Typography>

        <Grid container spacing={3}>
          {results.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ overflow: "hidden", height: "100%" }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ height: 220, borderBottom: `2px solid ${retroPalette.border}` }}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Button variant="contained" onClick={() => navigate(`/product/${product.id}`)}>
                    Ver detalles
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {results.length === 0 && (
          <Box sx={{ p: 4, bgcolor: "background.paper", border: `2px solid ${retroPalette.border}` }}>
            <Typography variant="h5">No encontramos productos con ese texto.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
