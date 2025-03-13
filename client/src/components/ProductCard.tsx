import React from "react";
import { Card, Text, Button, Flex } from "@radix-ui/themes";
import { Product } from "../types/Product";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Handle cases where the image is a File or null
 // Fallback image

  // Ensure price is a number before calling toFixed
  const formattedPrice =
    typeof product.price === "number" ? `$${product.price.toFixed(2)}` : "$0.00";

  return (
    <Card style={{ margin: "0 1rem", padding: "1rem", }}>
      <Flex direction="column" gap="3" align="center">
        <img
          src={`http://localhost:5000/${product.image}`}
          alt={product.name}
          style={{ width: "50%", height: "auto", borderRadius: "8px" }}
        />
        <Text size="5" weight="bold">
          {product.name}
        </Text>
        <Text size="4" color="gray">
          {formattedPrice} {/* Use the formatted price */}
        </Text>
        <Text size="3" color="gray">
          {product.description}
        </Text>
        <Button variant="solid">Add to Cart</Button>
      </Flex>
    </Card>
  );
};

export default ProductCard;