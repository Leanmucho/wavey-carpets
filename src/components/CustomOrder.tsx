import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { retroPalette } from "../style/theme";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE?.replace(/\D/g, "") ?? "";
const hasWhatsApp = /^[1-9]\d{9,14}$/.test(WHATSAPP_PHONE) && WHATSAPP_PHONE !== "1234567890";

const shapeLabels = {
  rectangular: "Rectangular",
  square: "Cuadrada",
  round: "Circular",
  oval: "Ovalada",
} as const;

type Shape = keyof typeof shapeLabels;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  shape: "rectangular" as Shape,
  width: "",
  height: "",
  colors: "",
  budget: "",
  deadline: "",
  design: "",
};

type CustomOrderForm = typeof initialForm;

const getPreviewShape = (shape: Shape) => {
  if (shape === "round") return { borderRadius: "50%", aspectRatio: "1" };
  if (shape === "oval") return { borderRadius: "50%", aspectRatio: "1.55" };
  if (shape === "square") return { borderRadius: "8px", aspectRatio: "1" };
  return { borderRadius: "8px", aspectRatio: "1.35" };
};

const buildWhatsAppMessage = (
  form: CustomOrderForm,
  imageUrl?: string,
  requestId?: string
) =>
  [
    "Hola Wavy Carpets, quiero pedir una alfombra personalizada.",
    requestId ? `Solicitud: ${requestId}` : "",
    `Nombre: ${form.name}`,
    `Email: ${form.email}`,
    `Teléfono: ${form.phone}`,
    `Forma: ${shapeLabels[form.shape]}`,
    `Medidas: ${form.width} x ${form.height} cm`,
    form.colors ? `Colores: ${form.colors}` : "",
    form.budget ? `Presupuesto aproximado: ${form.budget}` : "",
    form.deadline ? `Fecha ideal: ${form.deadline}` : "",
    `Diseño: ${form.design}`,
    imageUrl ? `Imagen de referencia: ${imageUrl}` : "Adjunto la imagen de referencia por WhatsApp.",
  ]
    .filter(Boolean)
    .join("\n");

const buildWhatsAppUrl = (
  form: CustomOrderForm,
  imageUrl?: string,
  requestId?: string
) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    buildWhatsAppMessage(form, imageUrl, requestId)
  )}`;

const CustomOrder = () => {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState(buildWhatsAppUrl(initialForm));

  const previewShape = useMemo(() => getPreviewShape(form.shape), [form.shape]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    setWhatsappUrl(buildWhatsAppUrl(form));
  }, [form]);

  const updateField = (field: keyof CustomOrderForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Completá tu nombre.";
    if (!form.email.trim()) return "Completá tu email.";
    if (!form.phone.trim()) return "Completá tu teléfono.";
    if (!form.width.trim()) return "Indicá el ancho en centímetros.";
    if (!form.height.trim()) return "Indicá el alto en centímetros.";
    if (!form.design.trim()) return "Contanos cómo querés el diseño.";
    if (!file) return "Subí una imagen de referencia.";
    return "";
  };

  const uploadReferenceImage = async () => {
    if (!file) return "";

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const imageRef = ref(storage, `custom-orders/${Date.now()}_${safeName}`);
    const snapshot = await uploadBytes(imageRef, file, {
      contentType: file.type,
    });

    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const imageUrl = await uploadReferenceImage();
      const requestRef = await addDoc(collection(db, "customOrders"), {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        shape: form.shape,
        shapeLabel: shapeLabels[form.shape],
        width: form.width.trim(),
        height: form.height.trim(),
        colors: form.colors.trim(),
        budget: form.budget.trim(),
        deadline: form.deadline,
        design: form.design.trim(),
        imageUrl,
        status: "pending",
        source: "web-custom-order",
        createdAt: serverTimestamp(),
      });

      setSuccess("Recibimos tu idea. Vamos a revisar el diseño y los datos para preparar tu presupuesto.");
      setWhatsappUrl(buildWhatsAppUrl(form, imageUrl, requestRef.id));
      setForm(initialForm);
      setFile(null);
    } catch (submitError) {
      console.error(submitError);
      setError(
        `${getFirebaseErrorMessage(submitError)} Revisá los datos e intentá nuevamente en unos minutos.`
      );
      setWhatsappUrl(buildWhatsAppUrl(form));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="main" sx={{ minHeight: "100vh", pt: { xs: 14, md: 16 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }} sx={{ minWidth: 0 }}>
            <Stack spacing={2} sx={{ position: { md: "sticky" }, top: { md: 120 } }}>
              <Chip label="Tu diseño, a medida" color="primary" sx={{ width: "fit-content" }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{ fontFamily: "'Archivo Black', 'Work Sans', sans-serif", fontSize: { xs: "clamp(1.8rem, 7.5vw, 2.6rem)", md: "clamp(1.8rem, 3vw, 2.6rem)" }, lineHeight: 1.08, overflowWrap: "anywhere", maxWidth: "100%" }}
              >
                Tu alfombra personalizada
              </Typography>
              <Typography color="text.secondary">
                Subí una imagen de referencia y contanos las medidas, la forma y los colores que imaginás. Revisamos tu diseño y te respondemos con un presupuesto a medida.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: retroPalette.paper,
                  border: `3px solid ${retroPalette.border}`,
                  boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    ...previewShape,
                    border: `3px solid ${retroPalette.border}`,
                    overflow: "hidden",
                    bgcolor: retroPalette.cream,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {previewUrl ? (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Referencia para alfombra personalizada"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography fontWeight={900} textAlign="center" sx={{ px: 2 }}>
                      Vista previa de tu forma
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>

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
              <Stack spacing={2.5}>
                <Typography variant="h4">Datos del pedido</Typography>
                {error && <Alert severity="warning">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

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
                      label="Teléfono"
                      fullWidth
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="outlined" component="label" sx={{ bgcolor: retroPalette.paper }}>
                      Subir imagen de referencia
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                      />
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {file ? file.name : "JPG, PNG o WEBP. Una imagen clara ayuda a presupuestar mejor."}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Forma</InputLabel>
                      <Select
                        label="Forma"
                        value={form.shape}
                        onChange={(event) => updateField("shape", event.target.value)}
                      >
                        {Object.entries(shapeLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField
                      label="Ancho cm"
                      fullWidth
                      value={form.width}
                      onChange={(event) => updateField("width", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <TextField
                      label="Alto cm"
                      fullWidth
                      value={form.height}
                      onChange={(event) => updateField("height", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Colores deseados"
                      fullWidth
                      value={form.colors}
                      onChange={(event) => updateField("colors", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Presupuesto aproximado"
                      fullWidth
                      value={form.budget}
                      onChange={(event) => updateField("budget", event.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Fecha ideal"
                      type="date"
                      fullWidth
                      value={form.deadline}
                      onChange={(event) => updateField("deadline", event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="¿Cómo imaginás tu alfombra?"
                      fullWidth
                      multiline
                      minRows={5}
                      value={form.design}
                      onChange={(event) => updateField("design", event.target.value)}
                    />
                  </Grid>
                </Grid>

                {saving && <LinearProgress />}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? "Enviando..." : "Solicitar presupuesto"}
                  </Button>
                  {hasWhatsApp && <Button
                    variant="outlined"
                    href={whatsappUrl}
                    target="_blank"
                    sx={{ bgcolor: retroPalette.paper }}
                  >
                    Consultar por WhatsApp
                  </Button>}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomOrder;
