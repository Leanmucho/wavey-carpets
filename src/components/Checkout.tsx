import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import type { CartItem } from "../types";
import { retroPalette } from "../style/theme";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

const STORE_EMAIL = "contacto@wavycarpets.com";
const WHATSAPP_PHONE = "1234567890";

const shippingLabels = {
  home: "Envio a domicilio",
  pickup: "Retiro / coordinar",
  quote: "Cotizar envio especial",
} as const;

const contactLabels = {
  whatsapp: "WhatsApp",
  email: "Email",
  both: "Email y WhatsApp",
} as const;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  notificationEmail: "",
  notificationPhone: "",
  preferredContact: "whatsapp" as keyof typeof contactLabels,
  shippingMethod: "home" as keyof typeof shippingLabels,
  address: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
};

type CheckoutForm = typeof initialForm;

interface OrderSnapshot {
  id?: string;
  customer: CheckoutForm;
  items: CartItem[];
  total: number;
  whatsappUrl: string;
  emailUrl: string;
}

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const getContactEmail = (customer: CheckoutForm) =>
  customer.notificationEmail.trim() || customer.email.trim();

const getContactPhone = (customer: CheckoutForm) =>
  customer.notificationPhone.trim() || customer.phone.trim();

const buildOrderDetail = (
  customer: CheckoutForm,
  items: CartItem[],
  total: number,
  orderId?: string
) => {
  const productLines = items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (${money.format(item.price * item.quantity)})`
    )
    .join("\n");

  return [
    "Detalle del pedido Wavy Carpets",
    orderId ? `Pedido: ${orderId}` : "",
    "",
    "Productos:",
    productLines,
    `Total: ${money.format(total)}`,
    "",
    "Cliente:",
    `Nombre: ${customer.name}`,
    `Email: ${customer.email}`,
    `Telefono: ${customer.phone}`,
    "",
    "Avisos del pedido:",
    `Email para avisos: ${getContactEmail(customer)}`,
    `Numero para avisos: ${getContactPhone(customer)}`,
    `Canal preferido: ${contactLabels[customer.preferredContact]}`,
    "",
    "Envio:",
    `Metodo: ${shippingLabels[customer.shippingMethod]}`,
    `Direccion: ${customer.address}`,
    `Ciudad: ${customer.city}`,
    `Provincia: ${customer.province}`,
    `Codigo postal: ${customer.postalCode}`,
    customer.notes ? `Notas: ${customer.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const buildWhatsAppUrl = (
  customer: CheckoutForm,
  items: CartItem[],
  total: number,
  orderId?: string
) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `Hola Wavy Carpets, quiero confirmar este pedido:\n\n${buildOrderDetail(
      customer,
      items,
      total,
      orderId
    )}`
  )}`;

const buildEmailUrl = (
  customer: CheckoutForm,
  items: CartItem[],
  total: number,
  orderId?: string
) =>
  `mailto:${getContactEmail(customer) || STORE_EMAIL}?subject=${encodeURIComponent(
    `Detalle de tu pedido Wavy Carpets${orderId ? ` #${orderId}` : ""}`
  )}&body=${encodeURIComponent(buildOrderDetail(customer, items, total, orderId))}`;

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderSnapshot | null>(null);

  const total = getCartTotal();
  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(form, cartItems, total),
    [cartItems, form, total]
  );
  const emailUrl = useMemo(
    () => buildEmailUrl(form, cartItems, total),
    [cartItems, form, total]
  );

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (cartItems.length === 0) return "Tu carrito esta vacio.";
    if (!form.name.trim()) return "Completa tu nombre.";
    if (!form.email.trim()) return "Completa tu email.";
    if (!form.phone.trim()) return "Completa tu telefono.";
    if (!getContactEmail(form)) return "Completa un email para avisos.";
    if (!getContactPhone(form)) return "Completa un numero para avisos.";
    if (form.shippingMethod !== "pickup" && !form.address.trim()) {
      return "Completa tu direccion de envio.";
    }
    if (!form.city.trim()) return "Completa tu ciudad.";
    if (!form.province.trim()) return "Completa tu provincia.";
    if (form.shippingMethod !== "pickup" && !form.postalCode.trim()) {
      return "Completa tu codigo postal.";
    }
    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const orderRef = await addDoc(collection(db, "orders"), {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          notes: form.notes.trim(),
        },
        notifications: {
          email: getContactEmail(form),
          phone: getContactPhone(form),
          preferredContact: form.preferredContact,
          preferredContactLabel: contactLabels[form.preferredContact],
        },
        shipping: {
          method: form.shippingMethod,
          methodLabel: shippingLabels[form.shippingMethod],
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
          postalCode: form.postalCode.trim(),
        },
        items: orderItems,
        total,
        paymentStatus: "pending",
        shippingStatus: "pending",
        status: "pending_payment",
        source: "web-checkout",
        userId: user?.uid ?? null,
        createdAt: serverTimestamp(),
      });

      setOrder({
        id: orderRef.id,
        customer: form,
        items: cartItems,
        total,
        whatsappUrl: buildWhatsAppUrl(form, cartItems, total, orderRef.id),
        emailUrl: buildEmailUrl(form, cartItems, total, orderRef.id),
      });
      clearCart();
    } catch (submitError) {
      console.error(submitError);
      setError(
        `${getFirebaseErrorMessage(submitError)} Podes enviarlo por WhatsApp o email con los botones de abajo.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (order) {
    return (
      <Box component="main" sx={{ minHeight: "78vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              bgcolor: retroPalette.paper,
              border: `3px solid ${retroPalette.border}`,
              boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h2" component="h1">
                Pedido recibido
              </Typography>
              <Alert severity="success">
                Guardamos tu pedido {order.id ? `#${order.id}` : ""}. El detalle queda listo para avisarle al cliente cuando se confirme el pago.
              </Alert>
              <Box>
                <Typography variant="h5">Total: {money.format(order.total)}</Typography>
                <Typography color="text.secondary">
                  Avisos a: {getContactEmail(order.customer)} / {getContactPhone(order.customer)}
                </Typography>
                <Typography color="text.secondary">
                  Envio: {shippingLabels[order.customer.shippingMethod]}
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" href={order.whatsappUrl} target="_blank">
                  Enviar por WhatsApp
                </Button>
                <Button variant="outlined" href={order.emailUrl} sx={{ bgcolor: retroPalette.paper }}>
                  Abrir email al cliente
                </Button>
              </Stack>
              <Button variant="outlined" onClick={() => navigate("/shop")}>
                Volver a productos
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h2" component="h1">
            Checkout
          </Typography>
          <Typography color="text.secondary">
            Revisa tu pedido y dejanos los datos de envio y contacto para pasar el detalle cuando el pago este confirmado.
          </Typography>
        </Stack>

        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: retroPalette.paper,
                border: `3px solid ${retroPalette.border}`,
                boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4">Datos del cliente</Typography>
                  <Typography color="text.secondary">
                    Datos base para identificar el pedido.
                  </Typography>
                </Box>
                {error && <Alert severity="warning">{error}</Alert>}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Nombre"
                      fullWidth
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Telefono"
                      fullWidth
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Divider />

                <Box>
                  <Typography variant="h4">Avisos del pedido</Typography>
                  <Typography color="text.secondary">
                    Email y numero donde se le pasaran los detalles despues del pago o confirmacion.
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email para recibir detalles"
                      type="email"
                      fullWidth
                      value={form.notificationEmail}
                      onChange={(event) => updateField("notificationEmail", event.target.value)}
                      placeholder={form.email || "cliente@email.com"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Numero para recibir detalles"
                      fullWidth
                      value={form.notificationPhone}
                      onChange={(event) => updateField("notificationPhone", event.target.value)}
                      placeholder={form.phone || "WhatsApp del cliente"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>Canal preferido</InputLabel>
                      <Select
                        label="Canal preferido"
                        value={form.preferredContact}
                        onChange={(event) => updateField("preferredContact", event.target.value)}
                      >
                        {Object.entries(contactLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider />

                <Box>
                  <Typography variant="h4">Envio</Typography>
                  <Typography color="text.secondary">
                    Datos para preparar el despacho del producto.
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>Metodo de envio</InputLabel>
                      <Select
                        label="Metodo de envio"
                        value={form.shippingMethod}
                        onChange={(event) => updateField("shippingMethod", event.target.value)}
                      >
                        {Object.entries(shippingLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Direccion"
                      fullWidth
                      value={form.address}
                      onChange={(event) => updateField("address", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Ciudad"
                      fullWidth
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Provincia"
                      fullWidth
                      value={form.province}
                      onChange={(event) => updateField("province", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Codigo postal"
                      fullWidth
                      value={form.postalCode}
                      onChange={(event) => updateField("postalCode", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Notas de entrega"
                      fullWidth
                      multiline
                      minRows={3}
                      value={form.notes}
                      onChange={(event) => updateField("notes", event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button type="submit" variant="contained" disabled={saving || cartItems.length === 0}>
                    {saving ? "Confirmando..." : "Confirmar pedido"}
                  </Button>
                  <Button
                    variant="outlined"
                    href={whatsappUrl}
                    target="_blank"
                    sx={{ bgcolor: retroPalette.paper }}
                    disabled={cartItems.length === 0}
                  >
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outlined"
                    href={emailUrl}
                    sx={{ bgcolor: retroPalette.paper }}
                    disabled={cartItems.length === 0}
                  >
                    Abrir email
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: retroPalette.paper,
                border: `3px solid ${retroPalette.border}`,
                boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h4">Resumen</Typography>
                {cartItems.length === 0 ? (
                  <Stack spacing={2}>
                    <Typography color="text.secondary">No hay productos en el carrito.</Typography>
                    <Button variant="contained" onClick={() => navigate("/shop")}>
                      Ver productos
                    </Button>
                  </Stack>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <Card key={item.id} sx={{ display: "flex", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            width: 96,
                            objectFit: "cover",
                            borderRight: `2px solid ${retroPalette.border}`,
                          }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                          <Typography fontWeight={900}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} x {money.format(item.price)}
                          </Typography>
                          <Typography fontWeight={900}>
                            {money.format(item.price * item.quantity)}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h5">Total</Typography>
                      <Typography variant="h5" sx={{ color: retroPalette.olive }}>
                        {money.format(total)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack spacing={1}>
                      <Typography variant="h6">Se guardara</Typography>
                      <Typography color="text.secondary">
                        Contacto: {getContactEmail(form) || "email del cliente"} / {getContactPhone(form) || "telefono del cliente"}
                      </Typography>
                      <Typography color="text.secondary">
                        Envio: {shippingLabels[form.shippingMethod]}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
