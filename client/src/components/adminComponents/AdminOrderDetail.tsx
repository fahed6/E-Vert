import { ArrowLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Box as Boxi,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Text
} from '@radix-ui/themes';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { OrderService } from '../../services/OrderService';
import { Address } from '../../types/Address';
import { User } from '../../types/User';

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
  address: Address;
  user: User;
}

const AdminOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderService = new OrderService();
  const navigate = useNavigate();

  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;
        const orderData = await orderService.getOrderById(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);
  

  const waitForImagesToLoad = (container: HTMLElement): Promise<void> => {
    const images = Array.from(container.getElementsByTagName("img"));
    const unloadedImages = images.filter((img) => !img.complete);
  
    return Promise.all(
      unloadedImages.map(
        (img) =>
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Still resolve if error
          })
      )
    ).then(() => {});
  };
  
  const exportAsPDF = async () => {
    if (!pdfRef.current) return;
  
    await waitForImagesToLoad(pdfRef.current); // ✅ Wait for all images in printable section
  
    const canvas = await html2canvas(pdfRef.current, {
      backgroundColor: '#fff',
      useCORS: true,
      scrollY: 0,
      scale: 2,
    });
  
    const imgData = canvas.toDataURL('image/png');
  
    if (!imgData.startsWith('data:image/png')) {
      console.error('Failed image data:', imgData.slice(0, 100));
      alert('Failed to generate image for PDF export.');
      return;
    }
  
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Order_${order?.id}.pdf`);
  };

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <BounceLoader color="#4CAF50" size={35} />
      </Box>
    );

  if (error) return <Text color="red">{error}</Text>;
  if (!order) return <Text>Order not found</Text>;

  return (
    <Boxi maxWidth="850px" style={{ padding: '1rem' }}>
      <Button
        variant="soft"
        onClick={() => navigate('/AdminDashboard')}
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

      {/* 👇 Normal styled version for UI */}
      <Flex direction="column" gap="5">
        <Heading size="5">Order Summary</Heading>

        <Card>
          <Heading size="4" mb="3">
            Order Details
          </Heading>
          <Grid columns="2" gap="4">
            <Text>
              <strong>Order Reference:</strong> #{order.id}
            </Text>
            <Text>
              <strong>Status:</strong> {order.orderState.toUpperCase()}
            </Text>
            <Text>
              <strong>Date:</strong>{' '}
              {new Date(order.createdAt).toLocaleString()}
            </Text>
            <Text>
              <strong>Total:</strong> ${order.cartSnapshot?.total.toFixed(2)}
            </Text>
          </Grid>
        </Card>

        <Card>
          <Heading size="4" mb="3">
            User Details
          </Heading>
          <Grid columns="2" gap="4">
            <Text>
              <strong>Name:</strong> {order.user.firstName}{' '}
              {order.user.lastName}
            </Text>
            <Text>
              <strong>Email:</strong> {order.user.email}
            </Text>
            <Text>
              <strong>Phone:</strong> {order.user.phoneNumber}
            </Text>
            <Text>
              <strong>Customer Reference:</strong> #{order.user.id}
            </Text>
          </Grid>
        </Card>

        <Card>
          <Heading size="4" mb="3">
            Delivery Address
          </Heading>
          <Text>
            {order.address.StreetAddress}
            <br />
            {order.address.City}, {order.address.State}{' '}
            {order.address.CodePost}
          </Text>
        </Card>

        <Card>
          <Heading size="4" mb="3">
            Items Ordered
          </Heading>
          <Flex direction="column" gap="3">
            {order.cartSnapshot?.items.map((item) => (
              <Card
                key={`${item.productId}-${item.size}`}
                variant="classic"
                style={{ padding: '1rem' }}
              >
                <Flex gap="4" align="center">
                  {item.imageUrl && (
                    <img
                    crossOrigin="anonymous"
                    src={`http://localhost:5000/${item.imageUrl}`}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-2)'
                    }}
                    onError={(e) => {
                      console.error("Image failed to load", item.imageUrl);
                      (e.target as HTMLImageElement).style.display = 'none';
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
            ))}
          </Flex>
        </Card>
      </Flex>

      <Button
        variant="solid"
        size="3"
        style={{ marginTop: '1rem' }}
        onClick={exportAsPDF}
      >
        Export as PDF
      </Button>

      {/* 👇 Off-screen (but renderable) PDF content */}
<div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
  <div
    ref={pdfRef}
    style={{
      padding: '20px',
      maxWidth: '800px',
      backgroundColor: '#fff',
      color: '#000',
    }}
  >
    <h2>Order #{order.id}</h2>
    <p><strong>Status:</strong> {order.orderState}</p>
    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
    <p><strong>Total:</strong>{order.cartSnapshot?.total.toFixed(2)}dt</p>

    <h3>Customer </h3>
    <p>{order.user.firstName} {order.user.lastName}</p>
    <p>Email: {order.user.email}</p>
    <p>Phone: {order.user.phoneNumber}</p>

    <h3>Address</h3>
    <p>{order.address.StreetAddress}, {order.address.City}, {order.address.State} {order.address.CodePost}</p>

    <h3>Items</h3>
    <ul>
      {order.cartSnapshot?.items.map(item => (
        <li key={item.productId}>
          {item.name} x{item.quantity} – ${item.price}
        </li>
      ))}
    </ul>
  </div>
</div>

    </Boxi>
  );
};

export default AdminOrderDetail;
