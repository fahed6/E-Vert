import { Box, Button, Card, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import useUserData from "../hooks/useUserData";
import { CategoryService } from "../services/CategoryService";
import { ProductService } from "../services/ProductService";
import { Product } from "../types/Product";

const AddProductForm: React.FC = () => {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    categories: [], // Updated to support multiple categories
    stock: 0,
    price: 0,
    image: null,
    ownerId: 0, // This will be updated with the user ID
  });

  const [categories, setCategories] = useState<string[]>([]); // List of available categories
  const [message, setMessage] = useState<string | null>(null);
  const productService = new ProductService();
  const categoryService = new CategoryService();

  // Call the hook at the top level
  const user = useUserData();

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.map((category: { name: any; }) => category.name)); // Extract category names
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct({
        ...product,
        image: file, // Store the file object
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProduct((prevProduct) => {
      const updatedCategories = checked
        ? [...prevProduct.categories!, value] // Add category if checked
        : prevProduct.categories!.filter((category) => category !== value); // Remove category if unchecked
      return {
        ...prevProduct,
        categories: updatedCategories,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("name", product.name || "");
      formData.append("description", product.description || "");
      formData.append("stock", String(product.stock));
      formData.append("price", String(product.price));
      formData.append("ownerId", String(user.id));
      if (product.image) {
        formData.append("image", product.image); // Append the file
      }
      // Append categories as a JSON string
      formData.append("categories", JSON.stringify(product.categories));

      // Send the FormData to the backend
      const newProduct = await productService.createProduct(formData);
      setMessage(`Product "${newProduct.name}" created successfully!`);
      setProduct({
        name: "",
        description: "",
        categories: [],
        stock: 0,
        price: 0,
        image: null,
        ownerId: 0, // Reset ownerId
      });
    } catch (error) {
      setMessage("Failed to create product. Please try again.");
      console.error(error);
    }
  };

  return (
    <Box maxWidth="750px">
      <Card>
        <Flex justify="between" align="center">
          <Text size="6">Add Product</Text>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="2" weight="bold">
                Name:
              </Text>
              <TextField.Root
                placeholder="Product Name..."
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">
                Description:
              </Text>
              <TextArea
                placeholder="Product Description..."
                radius="full"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">
                Categories:
              </Text>
              <Flex direction="column" gap="2">
                {categories.map((category) => (
                  <label key={category}>
                    <Flex align="center" gap="2">
                      <input
                        type="checkbox"
                        value={category}
                        checked={product.categories?.includes(category)}
                        onChange={handleCategoryChange}
                      />
                      <Text>{category}</Text>
                    </Flex>
                  </label>
                ))}
              </Flex>
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">
                Stock:
              </Text>
              <TextField.Root
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                required
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">
                Price:
              </Text>
              <TextField.Root
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">
                Image:
              </Text>
              <input type="file" name="image" onChange={handleFileChange} />
            </Box>

            <Flex gap="3" justify="end">
              <Button type="submit">Add Product</Button>
            </Flex>
          </Flex>
        </form>
        {message && (
          <Text color={message.includes("successfully") ? "green" : "red"} mt="3">
            {message}
          </Text>
        )}
      </Card>
    </Box>
  );
};

export default AddProductForm;