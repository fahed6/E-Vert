import React from "react";
import { Product } from "../types/Product";
import "./ProductCarousel/ProductMulti-Carousel.css"

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    
      <div className="card">
        <img className="product--image" src={`http://localhost:5000/${product.image}`} alt="product image" />
        <h3>{product.name}</h3>
        <p className="price"> {product.price} DT</p>
       
        <p>
          <button>Add to Cart</button>
        </p>
      </div>
      
    );
};

export default ProductCard;