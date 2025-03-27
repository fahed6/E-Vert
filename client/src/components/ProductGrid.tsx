import { Box, Card, Checkbox, Flex, Grid, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { CartService } from "../services/CartService";
import { CategoryService } from "../services/CategoryService";
import { ProductService } from "../services/ProductService";
import { Category } from "../types/Category";
import { Product } from "../types/Product";

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const navigate = useNavigate();
  const user = useUserData();
  const cartService = new CartService(); // Use the useNavigate hook

  // Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productData = await productService.getAllProducts();
        const productsWithNumberPrice = productData.map((product) => ({
          ...product,
          price: Number(product.price), // Convert price to a number
        }));
        setProducts(productsWithNumberPrice);

        // Fetch categories
        const categoryData = await categoryService.getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch products when selected categories change
  useEffect(() => {
    const fetchProductsByCategories = async () => {
      try {
        let productData;
        if (selectedCategories.length > 0) {
          // Fetch products for each selected category
          const productPromises = selectedCategories.map((categoryName) =>
            categoryService.getProductsByCategory(categoryName)
          );
          const productArrays = await Promise.all(productPromises);
          // Merge and deduplicate products
          const mergedProducts = productArrays.flat();
          const uniqueProducts = Array.from(new Set(mergedProducts.map((p) => p.id))).map(
            (id) => mergedProducts.find((p) => p.id === id)!
          );
          productData = uniqueProducts;
        } else {
          // Fetch all products if no categories are selected
          productData = await productService.getAllProducts();
        }
        const productsWithNumberPrice = productData.map((product) => ({
          ...product,
          price: Number(product.price), // Convert price to a number
        }));
        setProducts(productsWithNumberPrice);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProductsByCategories();
  }, [selectedCategories]);

  // Handle category selection
  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryName)) {
        // Remove category if already selected
        return prevSelected.filter((name) => name !== categoryName);
      } else {
        // Add category if not selected
        return [...prevSelected, categoryName];
      }
    });
  };

  // Navigate to product details page
  const handleProductClick = (productId: number) => {
    if (productId) {
      navigate(`/products/${productId}`); // Navigate to the standalone ProductDetails route
    } else {
      console.error("Product ID is undefined");
    }
  };


  const handleAddToCart = async (productid: number) => {
    if (!user?.id) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await cartService.addToCart(user.id, productid, 1); // Add 1 item by default
      alert("Product added to cart!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <Flex style={{ paddingTop: "50px" }}>
      {/* Sidebar for categories */}
      <Box width="200px" p="4" style={{ borderRight: "1px solid #eee" }}>
        <Text size="4" weight="bold" mb="4">
          Categories
        </Text>
        <Flex direction="column" gap="2">
          {categories.map((category) => (
            <label key={category.id}>
              <Flex align="center" gap="2">
                <Checkbox
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => handleCategoryChange(category.name)}
                />
                <Text>{category.name}</Text>
              </Flex>
            </label>
          ))}
        </Flex>
      </Box>

      {/* Product grid */}
      <Box flexGrow="1" p="4">
        <Text size="6" weight="bold" mb="4">
          Products
        </Text>
        <Grid columns="3" gap="5" width="auto">
          {products.map((product) => (
            <Card
              key={product.id}
              onClick={() => handleProductClick(product.id)} 
              style={{ cursor: "pointer" }}  // Add pointer cursor
            >
              <Flex direction="column" gap="3">
                {product.image && (
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    loading="lazy"
                  />
                )}
                <Text size="4" weight="bold">
                  {product.name}
                </Text>

                <Flex justify="between" align="center">
                  <Text size="2">Stock: {product.stock}</Text>
                  <Text size="2">{Number(product.price).toFixed(2)} DT</Text>
                </Flex>

                {/* Add to Cart button */}
                <button
                  style={{
                   borderRadius:"25px",
                   border:"none",
                    outline: "0",
                    padding: "10px",
                    color: "white",
                    backgroundColor: "#17451F",
                    textAlign: "center",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card's onClick from firing
                    handleAddToCart(product.id);
                  }}
                >
                  Add to Cart
                </button>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default ProductGrid;