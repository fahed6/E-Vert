// components/OrdersContent.tsx
import { Box, Pagination } from '@mui/material';
import { Badge, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { OrderService } from '../../services/OrderService';
import { OrderState } from '../../types/OrderState';
import Swal from 'sweetalert2';

interface Order {
  id: number;
  createdAt: string;
  orderState: OrderState;
  cartSnapshot: {
    total: number;
  } | null;
}

const OrdersContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const orderService = new OrderService();
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders({
          page: currentPage,
          limit: itemsPerPage
        });
        
        setOrders(response.data);
        setTotalCount(response.pagination.totalCount);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const getStatusColor = (status: OrderState) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'hold': return 'amber';
      case 'shipped': return 'blue';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUpdateOrderStatus = async (orderId: number, currentState: OrderState) => {
    try {
      setUpdatingOrderId(orderId);
      let newState: OrderState;

      if (currentState === 'hold') {
        newState = 'shipped';
      } else if (currentState === 'shipped') {
        newState = 'delivered';
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
        timer: 1500,
        showConfirmButton: false,

      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <BounceLoader color="#4CAF50" size={35}/>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading size="6" mb="4">Orders Management</Heading>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="6" mb="4">Orders Management ({totalCount} total)</Heading>
      
      <Card>
        <Flex direction="column" gap="3">
          {orders.length > 0 ? (
            <>
              {orders.map((order, index) => {
                const canUpdate = order.orderState !== 'delivered';
                const buttonText = 
                  order.orderState === 'hold' ? 'Mark as Shipped' : 
                  order.orderState === 'shipped' ? 'Mark as Delivered' : '';
                
                return (
                  <React.Fragment key={order.id}>
                    <Flex justify="between" align="center" py="2">
                      <Flex gap="3" align="center">
                        <Box>
                          <Text weight="bold">Order #{order.id}</Text><br></br>
                          <Text size="2" color="gray">{formatDate(order.createdAt)}</Text>
                        </Box>
                      </Flex>
                      <Flex gap="3" align="center">
                        <Text> ${order.cartSnapshot?.total.toFixed(2) || '0.00'}</Text>
                        <Badge color={getStatusColor(order.orderState)}>
                          {order.orderState}
                        </Badge>
                        {canUpdate && (
                          <Button 
                            variant="soft" 
                            size="1"
                            onClick={() => handleUpdateOrderStatus(order.id, order.orderState)}
                            disabled={updatingOrderId === order.id}
                          >
                            {updatingOrderId === order.id ? 'Updating...' : buttonText}
                          </Button>
                        )}
                        <Button 
                          variant="soft" 
                          size="1"
                          onClick={() => navigate(`/AdminDashboard/user/order/${order.id}`)}
                        >
                          View
                        </Button>
                      </Flex>
                    </Flex>
                    {index < orders.length - 1 && <Separator size="4" />}
                  </React.Fragment>
                );
              })}
              
              <Flex justify="center" mt="4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_event, page) => setCurrentPage(page)}
                />
              </Flex>
            </>
          ) : (
            <Text align="center">No orders found</Text>
          )}
        </Flex>
      </Card>
    </Box>
  );
};

export default OrdersContent;