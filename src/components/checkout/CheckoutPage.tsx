import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Typography, 
  Button, 
  Box, 
  TextField,
  CircularProgress,
  Alert
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
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://e-commerce-hfbs.onrender.com/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const { success, user } = await response.json();
        
        if (!success || !user) {
          throw new Error('Invalid user data received');
        }

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
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://e-commerce-hfbs.onrender.com/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('Order creation response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      if (data.success && data.order) {
        
        await clearAllCart();
        
        const orderId = data.order._id;
        console.log('Navigating to order confirmation with ID:', orderId); 
        navigate(`/order-confirmation/${orderId}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while processing your order.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => window.location.href = '/'}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Order Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Summary
        </Typography>
        {cart.map((item) => (
          <Card key={item.productId} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 100, objectFit: 'contain' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography color="primary">${item.price}</Typography>
              <Typography color="text.secondary">
                Quantity: {item.quantity}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shipping Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={userData.email}
              disabled
              fullWidth
            />
            <TextField
              label="Shipping Address"
              multiline
              rows={3}
              value={userData.shippingAddress}
              onChange={(e) => setUserData({ ...userData, shippingAddress: e.target.value })}
              required
              fullWidth
              disabled
              placeholder="Enter your full shipping address"
            />
          </Box>
        </Box>

        {/* Total and Submit */}
        <Box sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5">
            Total: ${getCartTotal().toFixed(2)}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CheckoutPage;