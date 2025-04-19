import { Box, Card, Checkbox, Flex, Grid, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUserData from "../hooks/useUserData";
import { CartService } from "../services/CartService";
import { CategoryService } from "../services/CategoryService";
import { ProductService } from "../services/ProductService";
import { Category } from "../types/Category";
import { Product } from "../types/Product";
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // Matches well with 3-column grid
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const productService = new ProductService();
  const categoryService = new CategoryService();
  const navigate = useNavigate();
  const user = useUserData();
  const cartService = new CartService();

  // Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products with pagination
        const productResponse = await productService.getAllProducts(
          pagination.page,
          pagination.limit
        );
        const productsWithNumberPrice = productResponse.data.map((product) => ({
          ...product,
          price: Number(product.price),
        }));
        setProducts(productsWithNumberPrice);
        setPagination(prev => ({
          ...prev,
          total: productResponse.pagination.total,
          totalPages: productResponse.pagination.totalPages,
        }));

        // Fetch categories
        const categoryData = await categoryService.getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Swal.fire({
          title: "Failed to load products",
          text: "Please try again later",
          icon: "error",
          timer: 2000,
          showConfirmButton: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.page]);

  // Fetch products when selected categories change
  useEffect(() => {
    const fetchProductsByCategories = async () => {
      setLoading(true);
      try {
        let productData: Product[] = [];
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
          const response = await productService.getAllProducts(
            pagination.page,
            pagination.limit
          );
          productData = response.data;
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
        
        const productsWithNumberPrice = productData.map((product) => ({
          ...product,
          price: Number(product.price),
        }));
        setProducts(productsWithNumberPrice);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        Swal.fire({
          title: "Failed to filter products",
          text: "Please try again",
          icon: "error",
          timer: 2000,
          showConfirmButton: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategories();
  }, [selectedCategories]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // ... rest of your existing handlers (handleCategoryChange, handleProductClick, handleAddToCart) remain exactly the same
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
    Swal.fire({
      title: "Please log in to add items to your cart.",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,  
    });
    return;
  }

  try {
    await cartService.addToCart(user.id, productid, 1); 
    Swal.fire({
      title: "Product added to cart!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,  
    });
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    Swal.fire({
      title: "Failed to add product to cart. Please try again.",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,  
    });
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
        
        {loading ? (
          <Flex justify="center" align="center" style={{ height: '300px' }}>
            <CircularProgress />
          </Flex>
        ) : (
          <>
            <Grid columns="3" gap="5" width="auto">
              {products.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => handleProductClick(product.id)} 
                  style={{ cursor: "pointer" }}
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

                    {/* Add to Cart button - remains exactly the same */}
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
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </Flex>
                </Card>
              ))}
            </Grid>

            {/* MUI Pagination - only show when no categories are selected */}
            {selectedCategories.length === 0 && pagination.totalPages > 1 && (
              <Flex justify="center" mt="5">
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#17451F',
                      fontSize: '1rem',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#17451F !important',
                      color: 'white',
                    },
                  }}
                />
              </Flex>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default ProductGrid;