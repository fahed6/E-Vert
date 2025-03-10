export interface Product {
    id?: number; 
    name: string;
    description: string;
    stock: number;
    price: number;
    image: string | null;
    ownerId: number; 
  }