import { Box, Button, Dialog, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Product } from "../../../../types/Product";
import { ProductService } from "../../../../services/ProductService";
import { CategoryService } from "../../../../services/CategoryService";
import useUserData from "../../../../hooks/useUserData";
import Swal from "sweetalert2";


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

  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const user = useUserData();

  useEffect(() => {
    if (!open) return;
    
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.map((category: { name: any }) => category.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProduct({ ...product, image: e.target.files[0] });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      categories: checked
        ? [...(prev.categories || []), value]
        : prev.categories?.filter(c => c !== value) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name || "");
      formData.append("description", product.description || "");
      formData.append("stock", String(product.stock));
      formData.append("price", String(product.price));
      formData.append("ownerId", String(user?.id));
      if (product.image) formData.append("image", product.image);
      formData.append("categories", JSON.stringify(product.categories));

      await productService.createProduct(formData);
      setMessage("Product created successfully!");
      Swal.fire({
        title: "Product created successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,  })
        
      setProduct({
        name: "",
        description: "",
        categories: [],
        stock: 0,
        price: 0,
        image: null,
        ownerId: 0,
      });
      setTimeout(() => setOpen(false), 1500);
    } catch (error) {
      setMessage("Failed to create product. Please try again.");
      Swal.fire({
        title: "Failed to create product",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,})
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
                {categories.map(category => (
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

            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit">Add Product</Button>
            </Flex>
          </Flex>
        </form>

        {message && (
          <Text color={message.includes("successfully") ? "green" : "red"} mt="3">
            {message}
          </Text>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddProductDialog;