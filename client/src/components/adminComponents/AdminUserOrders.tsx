import { Box } from '@mui/material';
import { Badge, Box as Boxi, Button, Card, Flex, Grid, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { ArrowLeft } from '@mui/icons-material';
import { OrderService } from '../../services/OrderService';
import { OrderState } from '../../types/OrderState';
import Swal from 'sweetalert2';

interface Order {
    id: number;
    createdAt: string;
    orderState: OrderState; // Changed to use OrderState type
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
    } | null;
}

const AdminUserOrders: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const orderService = new OrderService();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        try {
          const userOrders = await orderService.getUserOrders(parseInt(userId));
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
  }, [userId]);

  const getStatusColor = (status: OrderState) => {
    switch (status.toLowerCase()) { // Case-insensitive check
      case "hold": return 'orange';
      case "shipped": return 'blue';
      case "delivered": return 'green';
      default: return 'gray';
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, currentState: OrderState) => {
    try {
      setUpdatingOrderId(orderId);
      let newState: OrderState;

      if (currentState.toLowerCase() === "hold") {
        newState = "shipped";
      } else if (currentState.toLowerCase() === "shipped") {
        newState = "delivered";
      } else {
        return;
      }

      const updatedOrder = await orderService.updateOrderState(orderId, newState);
      
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));

      Swal.fire({
        title: `Order status updated to ${newState}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire({
        title: 'Failed to update order status!',
        icon: 'error',
        showConfirmButton: false,
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (error) return <Text color="red">{error}</Text>;
  if (loading) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <BounceLoader color="#4CAF50" size={35}/>
    </Box>
  );
  if (orders.length === 0) return (
    <Boxi style={{ padding: '2rem' }}>
      <Text>No orders found for this user</Text>
    </Boxi>
  );

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <Boxi maxWidth="750px" width="100%" style={{padding: '20px'}}>
        <Card variant="classic" style={{ 
          boxShadow: '0 9px 20px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.3s ease-in-out', 
          position: 'relative'
        }}>
          {/* Back Button */}
          <Button 
            variant="soft" 
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <ArrowLeft />
            Back to Dashboard
          </Button>

          <Flex direction="column" gap="4" style={{marginTop: '40px'}}>
            <Text size="5" weight="bold" align="center">User Orders</Text>
            
            {orders.map((order) => {
              const normalizedState = order.orderState.toLowerCase();
              const canUpdate = normalizedState !== 'delivered';
              
              return (
                <Card key={order.id} variant="classic" style={{ 
                  boxShadow: '0 1px 20px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}>
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="center">
                      <Text weight="bold">Order #{order.id}</Text>
                      <Flex align="center" gap="2">
                        <Badge color={getStatusColor(order.orderState)}>
                          {order.orderState.toUpperCase()}
                        </Badge>
                        {canUpdate && (
                          <Button
                            size="1"
                            variant="soft"
                            onClick={() => handleUpdateOrderStatus(order.id, order.orderState)}
                            disabled={updatingOrderId === order.id}
                          >
                            {updatingOrderId === order.id ? 'Updating...' : 
                             normalizedState === 'hold' ? 'Mark as Shipped' : 'Mark as Delivered'}
                          </Button>
                        )}
                      </Flex>
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
              );
            })}
          </Flex>
        </Card>
      </Boxi>
    </Box>
  );
};

export default AdminUserOrders;