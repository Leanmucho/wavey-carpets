import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { useCart } from "../context/useCart";
import type { Product } from "../types";
import { retroPalette } from "../style/theme";
import { normalizeProduct } from "../utils/productMapper";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProduct(null);
    const fetchProduct = async () => {
      if (!id) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (!active) return;
        if (docSnap.exists()) {
          setProduct(normalizeProduct(docSnap.id, docSnap.data()));
        } else {
          setProduct(null);
        }
      } catch {
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProduct();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", pt: 20, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: "70vh", pt: 20, textAlign: "center", px: 2 }}>
        <Typography variant="h4">Producto no encontrado</Typography>
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate("/shop")}>
          Volver a productos
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        pt: { xs: 14, md: 17 },
        pb: 10,
        px: { xs: 2, md: 6 },
      }}
    >
      <Grid container spacing={6} justifyContent="center" alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: { xs: 360, md: 560 },
              objectFit: "cover",
              border: `3px solid ${retroPalette.border}`,
              boxShadow: "10px 10px 0 rgba(25,23,20,0.22)",
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {product.isNew && <Chip label="Nuevo" color="secondary" />}
              {product.isSale && <Chip label="Sale" color="primary" />}
              {product.tags?.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" />
              ))}
            </Stack>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: "'Archivo Black', 'Work Sans', sans-serif",
                lineHeight: 0.95,
              }}
            >
              {product.name}
            </Typography>

            <Typography variant="h6" color="text.secondary">
              {product.description}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2">({product.rating})</Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h3" sx={{ color: retroPalette.olive }}>
                ${product.price.toFixed(2)}
              </Typography>
              {product.oldPrice && (
                <Typography variant="h6" sx={{ textDecoration: "line-through" }}>
                  ${product.oldPrice.toFixed(2)}
                </Typography>
              )}
            </Stack>

            <Button
              variant="contained"
              size="large"
              onClick={() => addItemToCart(product)}
              sx={{ width: { xs: "100%", sm: "fit-content" } }}
            >
              Agregar al carrito
            </Button>

            <Divider />

            <Box>
              <Typography variant="h5" gutterBottom>
                Especificaciones
              </Typography>
              <Typography>Material: {product.materials.join(", ")}</Typography>
              <Typography>Tamano: {product.size ?? "120x180 cm"}</Typography>
              <Typography>Origen: {product.origin ?? "Hecho en Argentina"}</Typography>
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom>
                Envios y devoluciones
              </Typography>
              <Typography color="text.secondary">
                Envios a todo el pais en 3 a 7 dias habiles. Cambios dentro de los 10 dias posteriores a la recepcion.
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductPage;
