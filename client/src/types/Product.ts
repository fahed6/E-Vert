import { Category } from "./Category";

export interface Product {
    id: number; 
    name: string;
    description: string;
    categories:  Category[] | string[];
    stock: number;
    price: number;
    image: string | File | null;
    ownerId: number; 
  }