import type { Product } from "../types";

type FirebaseProduct = Partial<Omit<Product, "id">> & {
  image?: unknown;
  images?: unknown;
};

const getString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

const getNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const getStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

export const normalizeProduct = (id: string, data: FirebaseProduct): Product => {
  const images = getStringArray(data.images);
  const image = getString(data.image, images[0] ?? "");
  const width = getString(data.width, "");
  const height = getString(data.height, "");

  return {
    id,
    name: getString(data.name, "Producto sin nombre"),
    image,
    images: images.length > 0 ? images : [image],
    description: getString(data.description, ""),
    price: getNumber(data.price, 0),
    oldPrice: typeof data.oldPrice === "number" ? data.oldPrice : undefined,
    rating: getNumber(data.rating, 0),
    isNew: typeof data.isNew === "boolean" ? data.isNew : false,
    isSale: typeof data.isSale === "boolean" ? data.isSale : false,
    colors: getStringArray(data.colors),
    materials: getStringArray(data.materials),
    tags: getStringArray(data.tags),
    size: data.size ?? (width && height ? `${width}x${height} cm` : undefined),
    origin: data.origin,
    width,
    height,
    shape: getString(data.shape, ""),
  };
};
