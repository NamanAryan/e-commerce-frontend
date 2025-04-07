import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Paper
} from '@mui/material';
import { 
  LocalShipping, 
  CheckCircle, 
  AccessTime 
} from '@mui/icons-material';

interface OrderItem {
  title: string;
  quantity: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: string;
  totalPrice: number;
  createdAt: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`https://e-commerce-hfbs.onrender.com/api/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Order not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Order Status Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'success.light', 
          color: 'white', 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CheckCircle fontSize="large" />
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Order Confirmed!
          </Typography>
          <Typography>
            Order #{order._id.slice(-6).toUpperCase()}
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { md: '2fr 1fr' } }}>
        {/* Left Column - Order Items */}
        <Box>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {order.orderItems.map((item, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: 80, height: 80, objectFit: 'contain' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography color="primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Card>

          {/* Shipping Status */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shipping Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccessTime color="primary" />
              <Box>
                <Typography variant="subtitle1">Order Processing</Typography>
                <Typography color="text.secondary" variant="body2">
                  Estimated delivery: 3-5 business days
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Right Column - Order Summary */}
        <Box>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Date
              </Typography>
              <Typography>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Shipping Address
              </Typography>
              <Typography>{order.shippingAddress}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Details
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 1 
              }}>
                <Typography>Total</Typography>
                <Typography variant="h6" color="primary">
                  ${order.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LocalShipping />}
              onClick={() => window.location.href = '/orders'}
              sx={{ mt: 2 }}
            >
              Track Order
            </Button>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;