export interface Product {
    id: number; 
    name: string;
    description: string;
    categories: string[];
    stock: number;
    price: number;
    image: string | File | null;
    ownerId: number; 
  }