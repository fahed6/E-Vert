import {
  Add as AddIcon,
  CancelOutlined as CancelIcon,
  Remove as RemoveIcon,
  DeleteOutline as TrashIcon
} from '@mui/icons-material';
import { Box as Boxi } from '@mui/material';
import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Table,
  Text,
  TextField
} from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import useUserData from '../hooks/useUserData';
import { CartService } from '../services/CartService';
import { Cart } from '../types/Cart';
import { CartItem } from '../types/CartItem';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const user = useUserData();
  const cartService = new CartService();
    const navigate = useNavigate();

  // Calculate total price from cart items
  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  useEffect(() => {
    // Fetch cart data when user is available
    const fetchCart = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cartData = await cartService.getCart(user.id);
        console.log("user id ="+user.id) // Pass userId here
        console.log("cart id ="+cartData.id)
        setCart(cartData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load your cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user?.id]); // Re-run effect when user ID changes

  const handleUpdateQuantity = async (productId: number, size: string, newQuantity: number) => {
    if (!user?.id || newQuantity < 0) return;

    try {
      setLoading(true);
      if (newQuantity === 0) {
        await cartService.removeFromCart(user.id, productId, size); // Pass userId here
      } else {
        await cartService.updateCartItem(user.id, productId, newQuantity, size); // Pass userId here
      }
      const updatedCart = await cartService.getCart(user.id); // Pass userId here
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to update cart:', err);
      setError('Failed to update your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number, size: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await cartService.removeFromCart(user.id, productId, size); // Pass userId here
      const updatedCart = await cartService.getCart(user.id); // Pass userId here
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item from your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await cartService.clearCart(user.id); // Pass userId here
      setCart({ items: [] });
      setClearCartDialogOpen(false);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container size="3" py="9">
        <Card size="3">
          <Flex direction="column" align="center" gap="4" p="6">
            <Heading size="5">Shopping Cart</Heading>
            <Text color="gray">Please log in to view your cart.</Text>
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </Flex>
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <Boxi
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
    <BounceLoader color="#4CAF50" size={35}/>
    </Boxi>
  );
  }

  if (error) {
    return (
      <Container size="3" py="9">
        <Card size="3">
          <Flex direction="column" align="center" gap="4" p="6">
            <Heading size="5">Shopping Cart</Heading>
            <Text color="red">{error}</Text>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Flex>
        </Card>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container size="3" py="9">
        <Card size="3">
          <Flex direction="column" align="center" gap="4" p="6">
            <Heading size="5">Your Cart</Heading>
            <Text color="gray">Your cart is empty.</Text>
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </Flex>
        </Card>
      </Container>
    );
  }

  // Calculate total price
  const totalPrice = calculateTotalPrice(cart.items);

  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Heading size="6">Your Cart</Heading>
          <Button color="red" variant="soft" onClick={() => setClearCartDialogOpen(true)}>
            <TrashIcon style={{ marginRight: '0.5rem' }} />
            Clear Cart
          </Button>
        </Flex>
        
        {error && (
          <Box mb="4">
            <Text color="red" size="2">{error}</Text>
          </Box>
        )}
        
        <Card>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {cart.items.map((item) => (
                <Table.Row key={`${item.product.id}-${item.size}`}>
                  <Table.Cell>
                    <Flex gap="3" align="center">
                      {item.product.image && typeof item.product.image === 'string' && (
                        <Box style={{ width: 60, height: 60 }}>
                          <img 
                            src={`http://localhost:5000/${item.product.image}`}
                            alt={item.product.name} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-2)'
                            }} 
                          />
                        </Box>
                      )}
                      <Text weight="medium">{item.product.name}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft" radius="full">{item.size}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2" align="center">
                      <Button 
                        variant="soft" 
                        size="1"
                        onClick={() => handleUpdateQuantity(item.product.id, item.size, item.quantity - 1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>
                      <TextField.Root 
                        size="1" 
                        value={item.quantity.toString()}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            handleUpdateQuantity(item.product.id, item.size, value);
                          }
                        }}
                        style={{ width: 50 }}
                      />
                      <Button 
                        variant="soft" 
                        size="1"
                        onClick={() => handleUpdateQuantity(item.product.id, item.size, item.quantity + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell align="right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Table.Cell>
                  <Table.Cell>
                    <Button 
                      variant="ghost" 
                      color="red" 
                      size="1"
                      onClick={() => handleRemoveItem(item.product.id, item.size)}
                    >
                      <CancelIcon fontSize="small" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
        
        <Card>
          <Flex direction="column" gap="3" p="4">
            <Flex justify="between">
              <Text size="2" color="gray">Subtotal</Text>
              <Text weight="medium">${totalPrice.toFixed(2)}</Text>
            </Flex>
            <Box style={{ height: 1, background: 'var(--gray-5)', margin: '8px 0' }}></Box>
            <Flex justify="between">
              <Text weight="bold">Total</Text>
              <Text weight="bold">${totalPrice.toFixed(2)}</Text>
            </Flex>
            <Button size="3" mt="2"  onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
          </Flex>
        </Card>
      </Flex>
      
      <AlertDialog.Root open={clearCartDialogOpen} onOpenChange={setClearCartDialogOpen}>
        <AlertDialog.Content>
          <AlertDialog.Title>Clear Cart</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Container>
  );
};

export default CartPage;