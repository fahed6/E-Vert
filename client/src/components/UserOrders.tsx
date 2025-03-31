import { Box } from '@mui/material';
import { Badge, Box as Boxi, Card, Flex, Grid, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import useUserData from '../hooks/useUserData';
import { OrderService } from '../services/OrderService';





interface Order {
    id: number;
    createdAt: string;
    orderState: string;
    cartSnapshot: {
      items: Array<{
        name: string;
        size: string | null;
        price: string;
        imageUrl: string;
        quantity: number;
        productId: number;
      }>;
      total: number;
    } | null;}


const ORDER_STATES = {
  HOLD: 'hold',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
} as const;

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserData();
  const orderService = new OrderService();
   const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const userOrders = await orderService.getUserOrders(user.id);
          setOrders(userOrders);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to load orders");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATES.HOLD: return 'orange';
      case ORDER_STATES.SHIPPED: return 'blue';
      case ORDER_STATES.DELIVERED: return 'green';
      default: return 'gray';
    }
  };

  if (!user)  return (
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
  if (orders.length === 0) return <Boxi style={{ padding: '2rem' }}><Text>No orders found</Text></Boxi>;


  return (
  <Boxi maxWidth="750px" style={{padding:'20px'}}>
    <Flex direction="column" gap="4">
      
      
      {orders.map((order) => (
        <Card key={order.id} variant="classic"  style={{ 
          boxShadow: '0 1px 20px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.3s ease-in-out',
        }}onClick={() => navigate(`/orders/${order.id}`)}>
          <Flex direction="column" gap="3">
            <Flex justify="between" align="center">
              <Text weight="bold">Order #{order.id}</Text>
              <Badge color={getStatusColor(order.orderState)}>
                {order.orderState.toUpperCase()}
              </Badge>
            </Flex>

            <Grid columns="2" gap="3">
              <Flex direction="column" gap="1">
                <Text color="gray">Date</Text>
                <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
              </Flex>

              <Flex direction="column" gap="1">
                <Text color="gray">Total</Text>
                <Text weight="bold">
                  ${order.cartSnapshot?.total.toFixed(2) || '0.00'}
                </Text>
              </Flex>
            </Grid>

            <Flex direction="column" gap="1">
              <Text color="gray">Items</Text>
              {order.cartSnapshot?.items?.map((item) => (
                <Flex key={`${item.productId}-${item.size}`} gap="2" align="center">
                  {item.imageUrl && (
                    <img 
                      src={`http://localhost:5000/${item.imageUrl}`} 
                      alt={item.name}
                      style={{ width: 40, height: 40, objectFit: 'cover' }}
                    />
                  )}
                  <Text>
                    {item.quantity} × {item.name} 
                    {item.size && ` (${item.size})`} - ${item.price}
                  </Text>
                </Flex>
              )) || <Text color="gray">No items available</Text>}
            </Flex>
          </Flex>
        </Card>
      ))}
    </Flex>
  </Boxi>
);
};

export default UserOrders;