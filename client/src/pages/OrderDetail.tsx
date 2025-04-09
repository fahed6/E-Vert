// src/components/OrderDetail.tsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/material';
import { Badge, Box as Boxi, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { OrderService } from '../services/OrderService';
import { Address } from '../types/Address';

interface OrderItem {
  name: string;
  size: string | null;
  price: string;
  imageUrl: string;
  quantity: number;
  productId: number;
}

interface Order {
  id: number;
  createdAt: string;
  orderState: string;
  cartSnapshot: {
    items: OrderItem[];
    total: number;
  } | null;
  address: Address
}

const ORDER_STATES = {
  HOLD: 'hold',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
} as const;

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderService = new OrderService();



  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;
  
        const orderData = await orderService.getOrderById(parseInt(orderId));
        setOrder(orderData);

      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATES.HOLD: return 'orange';
      case ORDER_STATES.SHIPPED: return 'blue';
      case ORDER_STATES.DELIVERED: return 'green';
      default: return 'gray';
    }
  };

  if (loading) return (
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

  if (error) return <Text color="red">{error}</Text>;

  if (!order) return <Text>Order not found</Text>;

  return (
    <Boxi maxWidth="750px" style={{ padding: '1rem' }}>
      <Flex direction="column" gap="4">
        <Button 
          variant="soft" 
          onClick={() => navigate(-1)}
          style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
        >
          <ArrowBackIcon sx={{ fontSize: '15px', marginRight: '5px' }} />
          Back to Profile
        </Button>

        
        
        <Card style={{ 
          width: '100%',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Text weight="bold">Order Status</Text>
              <Badge color={getStatusColor(order.orderState)} size="2">
                {order.orderState.toUpperCase()}
              </Badge>
            </Flex>

            <Grid columns="2" gap="3">
              <Flex direction="column" gap="1">
                <Text color="gray">Order Date</Text>
                <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text color="gray">Order Total</Text>
                <Text weight="bold" size="4">
                  ${order.cartSnapshot?.total.toFixed(2) || '0.00'}
                </Text>
              </Flex>
            </Grid>

            <Flex direction="column" gap="2">
              <Text weight="bold" size="4">Items</Text>
              {order.cartSnapshot?.items?.map((item) => (
                <Card key={`${item.productId}-${item.size}`} variant="classic" style={{ padding: '1rem' }}>
                  <Flex gap="4" align="center">
                    {item.imageUrl && (
                      <img 
                        src={`http://localhost:5000/${item.imageUrl}`} 
                        alt={item.name}
                        style={{ 
                          width: 80, 
                          height: 80, 
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-2)'
                        }}
                      />
                    )}
                    <Flex direction="column" flexGrow="1">
                      <Text weight="bold">{item.name}</Text>
                      {item.size && <Text color="gray">Size: {item.size}</Text>}
                      <Text>Quantity: {item.quantity}</Text>
                    </Flex>
                    <Text weight="bold">${item.price}</Text>
                  </Flex>
                </Card>
              )) || <Text color="gray">No items available</Text>}
            </Flex>
          </Flex>
        </Card>
        <Card>
          <Heading size="4" mb="3">Delivery Address</Heading>
          {order.address ? (
            <Text>
            State: {order.address.State}<br />
            City: {order.address.City}<br />
            Street: {order.address.StreetAddress}<br />
            Code Post: {order.address.CodePost}
          </Text>
          ) : (
            <Text color="red">No address found. Please add an address.</Text>
          )}
        </Card>
      </Flex>
    </Boxi>
  );
};

export default OrderDetail;