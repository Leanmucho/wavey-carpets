import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { useAuth } from "../context/useAuth";
import { retroPalette } from "../style/theme";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

const initialForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  rating: "5",
  width: "",
  height: "",
  shape: "rectangular",
  materials: "",
  isNew: true,
};

type ProductForm = typeof initialForm;

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  width: string;
  height: string;
  shape: string;
  materials: string[];
  isNew: boolean;
  image: string;
  images: string[];
}

const getString = (value: unknown) => (typeof value === "string" ? value : "");
const getNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;
const getStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previews]
  );

  useEffect(() => {
    if (!user) {
      setLoadingProducts(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const items = snapshot.docs.map((productDoc) => {
          const data = productDoc.data();
          const images = getStringArray(data.images);
          const image = getString(data.image) || images[0] || "";

          return {
            id: productDoc.id,
            name: getString(data.name),
            description: getString(data.description),
            price: getNumber(data.price),
            oldPrice:
              typeof data.oldPrice === "number" && Number.isFinite(data.oldPrice)
                ? data.oldPrice
                : undefined,
            rating: getNumber(data.rating, 5),
            width: getString(data.width),
            height: getString(data.height),
            shape: getString(data.shape) || "rectangular",
            materials: getStringArray(data.materials),
            isNew: typeof data.isNew === "boolean" ? data.isNew : false,
            image,
            images: images.length > 0 ? images : image ? [image] : [],
          };
        });

        setProducts(items.sort((a, b) => a.name.localeCompare(b.name, "es")));
        setLoadingProducts(false);
      },
      (snapshotError) => {
        console.error(snapshotError);
        setError(getFirebaseErrorMessage(snapshotError));
        setLoadingProducts(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const updateField = (field: keyof ProductForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setFiles([]);
    setExistingImages([]);
    setEditingId(null);
  };

  const uploadImages = async () => {
    const uploads = files.map(async (file) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const imageRef = ref(storage, `products/${Date.now()}_${safeName}`);
      const snapshot = await uploadBytes(imageRef, file, { contentType: file.type });
      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploads);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Tenés que iniciar sesión para administrar productos.");
      return;
    }

    if (existingImages.length + files.length === 0) {
      setError("Agregá al menos una imagen del producto.");
      return;
    }

    const price = Number(form.price);
    const oldPrice = form.oldPrice ? Number(form.oldPrice) : undefined;
    const rating = Number(form.rating);

    if (!form.name.trim() || !form.description.trim() || !Number.isFinite(price) || price < 0) {
      setError("Completá nombre, descripción y un precio válido.");
      return;
    }

    if (oldPrice !== undefined && (!Number.isFinite(oldPrice) || oldPrice < 0)) {
      setError("El precio anterior no es válido.");
      return;
    }

    setSaving(true);

    try {
      const newImageUrls = await uploadImages();
      const images = [...existingImages, ...newImageUrls];
      const materials = form.materials
        .split(",")
        .map((material) => material.trim())
        .filter(Boolean);
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        rating: Number.isFinite(rating) ? rating : 5,
        width: form.width.trim(),
        height: form.height.trim(),
        shape: form.shape.trim() || "rectangular",
        materials,
        isNew: form.isNew,
        images,
        image: images[0],
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        const previousImages = products.find((product) => product.id === editingId)?.images ?? [];
        await updateDoc(doc(db, "products", editingId), {
          ...productData,
          oldPrice: oldPrice ?? deleteField(),
        });
        const removedImages = previousImages.filter((imageUrl) => !images.includes(imageUrl));
        await Promise.allSettled(
          removedImages.map((imageUrl) => deleteObject(ref(storage, imageUrl)))
        );
        setMessage("Producto actualizado correctamente.");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          ...(oldPrice !== undefined ? { oldPrice } : {}),
          createdAt: serverTimestamp(),
        });
        setMessage("Producto cargado correctamente.");
      }

      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setError(getFirebaseErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setExistingImages(product.images);
    setFiles([]);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      oldPrice: product.oldPrice === undefined ? "" : String(product.oldPrice),
      rating: String(product.rating),
      width: product.width,
      height: product.height,
      shape: product.shape,
      materials: product.materials.join(", "),
      isNew: product.isNew,
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!pendingDelete || !user) return;

    const product = pendingDelete;
    setDeleting(true);
    setError("");
    setMessage("");

    try {
      await deleteDoc(doc(db, "products", product.id));
      await Promise.allSettled(
        product.images.map((imageUrl) => deleteObject(ref(storage, imageUrl)))
      );

      if (editingId === product.id) resetForm();
      setPendingDelete(null);
      setMessage(`“${product.name}” fue eliminado.`);
    } catch (deleteError) {
      console.error(deleteError);
      setError(getFirebaseErrorMessage(deleteError));
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <Box component="main" sx={{ minHeight: "75vh", pt: { xs: 14, md: 16 }, px: 2 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: `3px solid ${retroPalette.border}`,
              boxShadow: "8px 8px 0 rgba(25,23,20,0.2)",
              bgcolor: retroPalette.paper,
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Admin
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Iniciá sesión para administrar productos en Firebase.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Ir a login
            </Button>
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
            Admin productos
          </Typography>
          <Typography color="text.secondary">
            Creá, editá y eliminá los productos publicados en la tienda.
          </Typography>
        </Stack>

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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4" component="h2">
              {editingId ? "Editar producto" : "Nuevo producto"}
            </Typography>
            {editingId && (
              <Button variant="outlined" onClick={resetForm} disabled={saving}>
                Cancelar edición
              </Button>
            )}
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nombre"
                fullWidth
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Precio"
                type="number"
                fullWidth
                required
                slotProps={{ htmlInput: { min: 0, step: "any" } }}
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Precio anterior"
                type="number"
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: "any" } }}
                value={form.oldPrice}
                onChange={(event) => updateField("oldPrice", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Descripción"
                fullWidth
                required
                multiline
                minRows={3}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Rating"
                type="number"
                fullWidth
                slotProps={{ htmlInput: { min: 0, max: 5, step: 0.1 } }}
                value={form.rating}
                onChange={(event) => updateField("rating", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Ancho"
                fullWidth
                value={form.width}
                onChange={(event) => updateField("width", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Alto"
                fullWidth
                value={form.height}
                onChange={(event) => updateField("height", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Forma"
                fullWidth
                value={form.shape}
                onChange={(event) => updateField("shape", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Materiales separados por coma"
                fullWidth
                value={form.materials}
                onChange={(event) => updateField("materials", event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isNew}
                    onChange={(event) => updateField("isNew", event.target.checked)}
                  />
                }
                label="Marcar como nuevo"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="outlined" component="label" sx={{ bgcolor: retroPalette.paper }}>
                Agregar imágenes
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Podés conservar o quitar las imágenes actuales y sumar imágenes nuevas.
              </Typography>
            </Grid>

            {(existingImages.length > 0 || previews.length > 0) && (
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {existingImages.map((imageUrl) => (
                    <Grid key={imageUrl} size={{ xs: 6, sm: 4, md: 3 }}>
                      <Box sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={imageUrl}
                          alt="Imagen actual del producto"
                          sx={{
                            width: "100%",
                            aspectRatio: "1",
                            objectFit: "cover",
                            border: `2px solid ${retroPalette.border}`,
                          }}
                        />
                        <IconButton
                          aria-label="Quitar imagen actual"
                          onClick={() =>
                            setExistingImages((current) =>
                              current.filter((currentUrl) => currentUrl !== imageUrl)
                            )
                          }
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            bgcolor: retroPalette.paper,
                            "&:hover": { bgcolor: retroPalette.cream },
                          }}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  {previews.map((preview) => (
                    <Grid key={preview.url} size={{ xs: 6, sm: 4, md: 3 }}>
                      <Box sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={preview.url}
                          alt={preview.file.name}
                          sx={{
                            width: "100%",
                            aspectRatio: "1",
                            objectFit: "cover",
                            border: `2px solid ${retroPalette.border}`,
                          }}
                        />
                        <IconButton
                          aria-label={`Quitar ${preview.file.name}`}
                          onClick={() =>
                            setFiles((current) => current.filter((file) => file !== preview.file))
                          }
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            bgcolor: retroPalette.paper,
                            "&:hover": { bgcolor: retroPalette.cream },
                          }}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              {saving && <LinearProgress sx={{ mb: 2 }} />}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
              <Button type="submit" variant="contained" disabled={saving}>
                {saving
                  ? editingId
                    ? "Guardando..."
                    : "Cargando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Guardar producto"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 7 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
            Productos publicados
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {products.length} {products.length === 1 ? "producto" : "productos"} en Firebase
          </Typography>

          {loadingProducts && <LinearProgress />}
          {!loadingProducts && products.length === 0 && (
            <Alert severity="info">Todavía no hay productos cargados.</Alert>
          )}

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ aspectRatio: "4 / 3", objectFit: "cover" }}
                  />
                  <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      ${product.price.toLocaleString("es-AR")}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(product)}
                        sx={{ flex: 1, bgcolor: retroPalette.paper }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setPendingDelete(product)}
                        sx={{ flex: 1, bgcolor: retroPalette.paper }}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Dialog open={Boolean(pendingDelete)} onClose={() => !deleting && setPendingDelete(null)}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que querés eliminar “{pendingDelete?.name}”? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;
