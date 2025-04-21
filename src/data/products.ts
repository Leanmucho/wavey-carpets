export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  colors: string[];
  materials: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Alfombra Persiana Vintage",
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-4.0.3",
    price: 349,
    oldPrice: 499,
    rating: 4.7,
    isNew: true,
    isSale: true,
    colors: ["#D62246", "#1A1A1A", "#F0E6D2"],
    materials: ["Lana", "Algodón"],
  },
  {
    id: 2,
    name: "Alfombra Boho Chic",
    image: "https://images.unsplash.com/photo-1579639782539-15cc6c0be63f?ixlib=rb-4.0.3",
    price: 279,
    rating: 4.3,
    isNew: false,
    colors: ["#4F772D", "#FFD166", "#FFFFFF"],
    materials: ["Algodón Orgánico"],
  },
  {
    id: 3,
    name: "Alfombra Étnica Tribal",
    image: "https://images.unsplash.com/photo-1593627365173-01c0be84a3ae?ixlib=rb-4.0.3",
    price: 399,
    oldPrice: 459,
    rating: 4.9,
    isNew: true,
    isSale: true,
    colors: ["#FFD166", "#F0E6D2", "#1A1A1A"],
    materials: ["Lana", "Yute"],
  },
  {
    id: 4,
    name: "Alfombra Escandinava Moderna",
    image: "https://images.unsplash.com/photo-1616486029642-9741a4eec6f2?ixlib=rb-4.0.3",
    price: 315,
    rating: 4.2,
    colors: ["#F0E6D2", "#4F772D"],
    materials: ["Poliéster", "Algodón"],
  },
  {
    id: 5,
    name: "Alfombra Minimal Japonesa",
    image: "https://images.unsplash.com/photo-1618220023734-60d43c71c8b2?ixlib=rb-4.0.3",
    price: 289,
    rating: 4.5,
    isNew: true,
    colors: ["#FFFFFF", "#D62246"],
    materials: ["Bambú", "Algodón Orgánico"],
  },
  {
    id: 6,
    name: "Alfombra Retro 70s",
    image: "https://images.unsplash.com/photo-1618220432221-f18f3483e6b2?ixlib=rb-4.0.3",
    price: 219,
    rating: 4.0,
    isSale: true,
    oldPrice: 299,
    colors: ["#D62246", "#FFD166", "#1A1A1A"],
    materials: ["Lana", "Poliéster"],
  }
];
