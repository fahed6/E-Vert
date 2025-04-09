// components/OrdersContent.tsx
import { Box, Pagination } from '@mui/material';
import { Badge, Button, Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { OrderService } from '../../services/OrderService';
import { OrderState } from '../../types/OrderState';

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
      case 'DELIVERED': return 'green';
      case 'HOLD': return 'amber';
      case 'SHIPPED': return 'blue';
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
              {orders.map((order, index) => (
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
              ))}
              
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