import { Box, Button, Dialog, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Product } from "../../../../types/Product";
import { ProductService } from "../../../../services/ProductService";
import { CategoryService } from "../../../../services/CategoryService";
import useUserData from "../../../../hooks/useUserData";
import Swal from "sweetalert2";
import { Category } from "../../../../types/Category";

const AddProductDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    categories: [],
    stock: 0,
    price: 0,
    image: null,
    ownerId: 0,
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const user = useUserData();

  // Get current category names for easier comparison
  const currentCategoryNames = product.categories?.map(c => 
    typeof c === 'string' ? c : c.name
  ) || [];

  useEffect(() => {
    if (!open) return;
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getAllCategories();
        setAvailableCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setMessage("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProduct(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProduct(prev => {
      const currentNames = prev.categories?.map(c => 
        typeof c === 'string' ? c : c.name
      ) || [];
      
      const newNames = checked
        ? [...currentNames, value]
        : currentNames.filter(name => name !== value);

      return {
        ...prev,
        categories: newNames // Store as string names (will be converted to Category objects in backend)
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData();
      formData.append("name", product.name || "");
      formData.append("description", product.description || "");
      formData.append("stock", String(product.stock || 0));
      formData.append("price", String(product.price || 0));
      formData.append("ownerId", String(user.id));
      
      // Append image if exists
      if (product.image) {
        formData.append("image", product.image);
      }
      
      // Stringify category names
      formData.append("categories", JSON.stringify(
        product.categories?.map(c => typeof c === 'string' ? c : c.name) || []
      ));

      setIsLoading(true);
      await productService.createProduct(formData);
      
      Swal.fire({
        title: "Product created successfully!",
        icon: "success",
        showConfirmButton: false,
          timer: 1500, 
      });

      // Reset form
      setProduct({
        name: "",
        description: "",
        categories: [],
        stock: 0,
        price: 0,
        image: null,
        ownerId: 0,
      });
      setOpen(false);
    } catch (error) {
      console.error("Create product error:", error);
      Swal.fire({
        title: "Failed to create product!",
        icon: "error",
        showConfirmButton: false,
          timer: 1500, 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>Add New Product</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 750 }}>
        <Dialog.Title>Add New Product</Dialog.Title>
        
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            {/* Name Field */}
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

            {/* Description Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Description:
              </Text>
              <TextArea
                placeholder="Product Description..."
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
              />
            </Box>

            {/* Categories Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Categories:
              </Text>
              {isLoading ? (
                <Text>Loading categories...</Text>
              ) : (
                <Flex direction="column" gap="2">
                  {availableCategories.map(category => (
                    <label key={category.id}>
                      <Flex align="center" gap="2">
                        <input
                          type="checkbox"
                          value={category.name}
                          checked={currentCategoryNames.includes(category.name)}
                          onChange={handleCategoryChange}
                        />
                        <Text>{category.name}</Text>
                      </Flex>
                    </label>
                  ))}
                </Flex>
              )}
            </Box>

            {/* Stock Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Stock:
              </Text>
              <TextField.Root
                type="number"
                name="stock"
                value={product.stock || 0}
                onChange={handleInputChange}
                min="0"
                required
              />
            </Box>

            {/* Price Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Price:
              </Text>
              <TextField.Root
                type="number"
                name="price"
                value={product.price || 0}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </Box>

            {/* Image Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Image:
              </Text>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange} 
              />
            </Box>

            {/* Form Actions */}
            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Add Product"}
              </Button>
            </Flex>
          </Flex>
        </form>

        {message && (
          <Text color={message.includes("success") ? "green" : "red"} mt="3">
            {message}
          </Text>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddProductDialog;