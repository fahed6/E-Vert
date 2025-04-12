import { Box, Button, Dialog, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Product } from "../../../../types/Product";
import { ProductService } from "../../../../services/ProductService";
import { CategoryService } from "../../../../services/CategoryService";
import Swal from "sweetalert2";
import { Category } from "../../../../types/Category";

interface UpdateProductDialogProps {
  product: Product;
  onProductUpdated: (updatedProduct: Product) => void;
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({ 
  product: initialProduct, 
  onProductUpdated 
}) => {
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const productService = new ProductService();
  const categoryService = new CategoryService();

  // Normalize categories to string names for easier comparison
  const currentCategoryNames = currentProduct.categories?.map(c => 
    typeof c === 'string' ? c : c.name
  ) || [];

  useEffect(() => {
    if (!open) return;

    // Reset form when dialog opens
    setCurrentProduct(initialProduct);

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categories = await categoryService.getAllCategories();
        setAvailableCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        Swal.fire("Error", "Failed to load categories", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [open, initialProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'price' ? Number(value) : value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCurrentProduct(prev => {
      const currentNames = prev.categories?.map(c => 
        typeof c === 'string' ? c : c.name
      ) || [];
      
      const newNames = checked
        ? [...currentNames, value]
        : currentNames.filter(name => name !== value);

      return {
        ...prev,
        categories: newNames // Store as string names for FormData
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all fields
      formData.append('name', currentProduct.name);
      formData.append('description', currentProduct.description);
      formData.append('stock', currentProduct.stock.toString());
      formData.append('price', currentProduct.price.toString());
      
      // Ensure categories are sent as JSON array of strings
      formData.append('categories', JSON.stringify(
        currentProduct.categories?.map(c => typeof c === 'string' ? c : c.name) || []
      ));
      
      // Handle image upload
      if (currentProduct.image instanceof File) {
        formData.append('image', currentProduct.image);
      } else if (currentProduct.image === null) {
        // Explicitly handle image removal if needed
        formData.append('image', '');
      }

      const updatedProduct = await productService.updateProduct(
        currentProduct.id,
        formData
      );

      onProductUpdated(updatedProduct);
      Swal.fire({
        title: "Product updated successfully!",
        icon: "success",
        showConfirmButton: false,
          timer: 1500, 
      });
      setOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        title: "Failed to update product!",
        icon: "error",
        showConfirmButton: false,
          timer: 1500, 
 
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="soft" size="1">Edit</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 750 }}>
        <Dialog.Title>Update Product</Dialog.Title>
        
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            {/* Name Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Name:
              </Text>
              <TextField.Root
                name="name"
                value={currentProduct.name}
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
                name="description"
                value={currentProduct.description}
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
                value={currentProduct.stock}
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
                value={currentProduct.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </Box>

            {/* Image Field */}
            <Box>
              <Text as="label" size="2" weight="bold">
                Current Image:
              </Text>
              {currentProduct.image && typeof currentProduct.image === 'string' && (
                <img 
                  src={`http://localhost:5000/${currentProduct.image}`} 
                  alt="Product" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '120px',
                    borderRadius: 'var(--radius-2)',
                    marginBottom: '1rem'
                  }}
                />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCurrentProduct(prev => ({
                      ...prev,
                      image: e.target.files![0]
                    }));
                  }
                }}
              />
            </Box>

            {/* Form Actions */}
            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">Cancel</Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Product"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UpdateProductDialog;