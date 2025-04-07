// src/components/orders/OrdersPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Button
} from '@mui/material';
import { LocalShipping, AccessTime } from '@mui/icons-material';

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

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://e-commerce-hfbs.onrender.com/api/order/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error instanceof Error ? error.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId: string) => {
    navigate(`/order-confirmation/${orderId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            You haven't placed any orders yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {orders.map((order) => (
            <Card
              key={order._id}
              sx={{
                p: 3,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
              onClick={() => handleOrderClick(order._id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order._id.slice(-6).toUpperCase()}
                </Typography>
                <Typography color="primary" variant="subtitle1">
                  ${order.totalPrice.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography color="text.secondary">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {order.orderItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flex: '1 1 300px',
                      minWidth: 0
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'contain'
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap>{item.title}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 2,
                color: 'success.main'
              }}>
                <LocalShipping fontSize="small" />
                <Typography variant="body2">
                  Shipped to: {order.shippingAddress}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrdersPage;