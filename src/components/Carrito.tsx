import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Product } from "./Shop";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Product[]>([]);

  // Recuperar el carrito desde el almacenamiento local
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Actualizar el almacenamiento local
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  return (
    <Box sx={{ pt: 10, pb: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Carrito de Compras
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center" }}>
          Tu carrito está vacío
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ display: "flex", bgcolor: "background.paper" }}>
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <IconButton onClick={() => removeFromCart(product.id)}>
                    <Delete color="error" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Total: ${calculateTotal().toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#D62246", ":hover": { backgroundColor: "#B91C35" } }}
          onClick={() => navigate("/checkout")}
        >
          Proceder al Pago
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
