import { products as fallbackProducts } from "../data/products";
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
  const fallback = fallbackProducts.find((product) => product.id === id) ?? fallbackProducts[0];
  const images = getStringArray(data.images);
  const image = getString(data.image, images[0] ?? fallback.image);
  const width = getString(data.width, fallback.width ?? "");
  const height = getString(data.height, fallback.height ?? "");

  return {
    id,
    name: getString(data.name, fallback.name),
    image,
    images: images.length > 0 ? images : [image],
    description: getString(data.description, fallback.description),
    price: getNumber(data.price, fallback.price),
    oldPrice: typeof data.oldPrice === "number" ? data.oldPrice : fallback.oldPrice,
    rating: getNumber(data.rating, fallback.rating),
    isNew: typeof data.isNew === "boolean" ? data.isNew : fallback.isNew,
    isSale: typeof data.isSale === "boolean" ? data.isSale : fallback.isSale,
    colors: getStringArray(data.colors).length > 0 ? getStringArray(data.colors) : fallback.colors,
    materials: getStringArray(data.materials).length > 0 ? getStringArray(data.materials) : fallback.materials,
    tags: getStringArray(data.tags).length > 0 ? getStringArray(data.tags) : fallback.tags,
    size: data.size ?? (width && height ? `${width}x${height} cm` : fallback.size),
    origin: data.origin ?? fallback.origin,
    width,
    height,
    shape: getString(data.shape, fallback.shape ?? ""),
  };
};
