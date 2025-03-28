import { Box } from '@mui/material';
import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  RadioGroup,
  Table,
  Text
} from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import useUserData from '../hooks/useUserData';
import { AddressService } from '../services/AddressService';
import { CartService } from '../services/CartService';
import { OrderService } from '../services/OrderService';
import { Address } from '../types/Address';
import { Cart } from '../types/Cart';
import { PaymentMethod } from '../types/PaymentMethod';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserData();
  
  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartService = new CartService();
  const orderService= new OrderService();
  const addressService = new AddressService();

  useEffect(() => {
    // If user is defined (not undefined), fetch data
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch cart
          const cartData = await cartService.getCart(user.id);
          
          // If cart is empty, redirect to products
          if (!cartData || cartData.items.length === 0) {
            navigate('/products');
            return;
          }
          setCart(cartData);

          // Fetch user address
          const userAddress = await addressService.getAddressByUserId(user.id);
          setAddress(userAddress);
        } catch (err) {
          console.error('Checkout fetch error:', err);
          setError('Failed to load checkout information');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user, navigate]);

  const calculateTotalPrice = () => {
    return cart?.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0) || 0;
  };

  const handleCheckout = async () => {
    if (!user || !address || !paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      const checkoutData = {
        cartId: cart?.id || 0,
        userId: user.id,      
        addressId: address.id,
        paymentMethod,
        amount: calculateTotalPrice()
      };
      console.log(checkoutData)
      await orderService.checkout(user.id, checkoutData);
     console.log(checkoutData)
      
      // Clear cart after successful checkout
      await cartService.clearCart(user.id);
      
      // Redirect to order confirmation or orders page
      navigate('/orders/confirmation');
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to complete checkout');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
    <BounceLoader color="#4CAF50" size={35}/>
    </Box>
  );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Text color="red">{error}</Text>
          <Button onClick={() => {
            setError(null);
            // Retry fetching data
            if (user) {
              const refetchData = async () => {
                try {
                  setLoading(true);
                  const cartData = await cartService.getCart(user.id);
                  setCart(cartData);
                  const userAddress = await addressService.getAddressByUserId(user.id);
                  setAddress(userAddress);
                } catch (err) {
                  console.error('Refetch error:', err);
                  setError('Failed to reload checkout information');
                } finally {
                  setLoading(false);
                }
              };
              refetchData();
            }
          }}>Try Again</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="3" py="6">
      <Heading mb="4">Checkout</Heading>
      
      <Flex direction="column" gap="4">
        {/* Cart Items Section */}
        <Card>
          <Heading size="4" mb="3">Order Items</Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Price</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cart?.items.map((item) => (
                <Table.Row key={`${item.product.id}-${item.size}`}>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <img 
                        src={`http://localhost:5000/${item.product.image}`} 
                        alt={item.product.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                      {item.product.name}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{item.size}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell align="right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        {/* Address Section */}
        <Card>
          <Heading size="4" mb="3">Delivery Address</Heading>
          {address ? (
            <Text>
              {address.street}
            </Text>
          ) : (
            <Text color="red">No address found. Please add an address.</Text>
          )}
        </Card>

        {/* Payment Method Section */}
        <Card>
          <Heading size="4" mb="3">Payment Method</Heading>
          <RadioGroup.Root 
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          >
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <RadioGroup.Item value="delivery" />
                <Text>Pay at Delivery</Text>
              </Flex>
              <Flex align="center" gap="2">
                <RadioGroup.Item value="store_pickup" />
                <Text>Store Pickup</Text>
              </Flex>
              <Flex align="center" gap="2">
                <RadioGroup.Item value="card" />
                <Text>Card Payment</Text>
              </Flex>
            </Flex>
          </RadioGroup.Root>
        </Card>

        {/* Total and Checkout */}
        <Card>
          <Flex direction="column" gap="3">
            <Flex justify="between">
              <Text weight="bold">Total</Text>
              <Text weight="bold">${calculateTotalPrice().toFixed(2)}</Text>
            </Flex>
            <Button 
              size="3" 
              onClick={handleCheckout}
              disabled={!address || !paymentMethod}
            >
              Complete Checkout
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default CheckoutPage;