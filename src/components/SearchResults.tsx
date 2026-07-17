import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import type { Product } from "../types";
import { normalizeProduct } from "../utils/productMapper";
import { retroPalette } from "../style/theme";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const searchTerm = query.get("q")?.trim() ?? "";
  const normalizedSearch = searchTerm.toLowerCase();
  const results = products.filter((product) =>
    [product.name, product.description, product.materials.join(" "), product.tags?.join(" ") ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        setProducts(snapshot.docs.map((productDoc) =>
          normalizeProduct(productDoc.id, productDoc.data())
        ));
      } catch {
        setLoadError("No pudimos cargar los productos para realizar la búsqueda.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  return (
    <Box component="main" sx={{ minHeight: "80vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom>
          Busqueda
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Resultados para "{searchTerm}"
        </Typography>

        {loading && (
          <Box sx={{ minHeight: 240, display: "grid", placeItems: "center" }}>
            <CircularProgress aria-label="Cargando productos" />
          </Box>
        )}
        {loadError && <Alert severity="error">{loadError}</Alert>}

        {!loading && !loadError && <Grid container spacing={3}>
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
        </Grid>}

        {!loading && !loadError && results.length === 0 && (
          <Box sx={{ p: 4, bgcolor: "background.paper", border: `2px solid ${retroPalette.border}` }}>
            <Typography variant="h5">No encontramos productos con ese texto.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
