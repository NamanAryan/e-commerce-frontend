import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useCart } from '../../context/CartContext';

interface UserData {
  email: string;
  shippingAddress: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearAllCart } = useCart();
  const [userData, setUserData] = useState<UserData>({
    email: '',
    shippingAddress: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('https://e-commerce-hfbs.onrender.com/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const { success, user } = await response.json();

        if (!success || !user) throw new Error('Invalid user data received');

        setUserData({
          email: user.email || '',
          shippingAddress: user.address || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        title: item.title,
        quantity: item.quantity,
        image: item.image,
        price: Number(item.price)
      }));

      const totalPrice = getCartTotal();

      const orderData = {
        orderItems,
        shippingAddress: userData.shippingAddress,
        totalPrice: Number(totalPrice.toFixed(2))
      };

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('https://e-commerce-hfbs.onrender.com/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create order');

      if (data.success && data.order) {
        await clearAllCart();
        navigate(`/order-confirmation/${data.order._id}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          Your cart is empty
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Cart Summary */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          {cart.map((item) => (
            <Card key={item.productId} sx={{ display: 'flex', mb: 2, p: 2 }}>
              <Box sx={{ width: 100, height: 100, mr: 2 }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography color="primary">${item.price}</Typography>
                <Typography color="text.secondary">Qty: {item.quantity}</Typography>
              </Box>
            </Card>
          ))}
        </Grid>

        {/* Right Column - Shipping + Submit */}
        <Grid item xs={12} md={5}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>

              <TextField
                label="Email"
                type="email"
                value={userData.email}
                fullWidth
                disabled
                margin="normal"
              />

              <TextField
                label="Shipping Address"
                multiline
                rows={4}
                value={userData.shippingAddress}
                onChange={(e) => setUserData({ ...userData, shippingAddress: e.target.value })}
                fullWidth
                required
                margin="normal"
              />

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Total: ${getCartTotal().toFixed(2)}
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </Box>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
