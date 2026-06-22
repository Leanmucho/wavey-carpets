export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  colors?: string[];
  materials: string[];
  tags?: string[];
  size?: string;
  origin?: string;
  width?: string;
  height?: string;
  shape?: string;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
}
