// src/components/Cart.tsx
import { useEffect } from 'react';
import { Container, Card, Typography, Button, Box } from '@mui/material';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getMyCart } = useCart();

  useEffect(() => {
    getMyCart();
  }, [getMyCart]);

  return (
    <Container sx={{ py: 4 }}>
      {cart.map((item, index) => (  // Added index
        <Card 
          // Using multiple properties to create a unique key
          key={`cart-item-${item.productId}-${index}`}  
          sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}
        >
          <Box sx={{ width: 100, height: 100, overflow: 'hidden' }}>
            <img 
              src={item.image} 
              alt={item.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{item.title}</Typography>
            <Typography color="primary">${item.price}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
              >
                -
              </Button>
              
              <Typography>{item.quantity}</Typography>
              
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </Button>

              <Button 
                variant="outlined" 
                color="error"
                onClick={() => removeFromCart(item.productId)}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Card>
      ))}

      {cart.length > 0 ? (
        <Box sx={{ 
          mt: 4, 
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
          <Button variant="contained" color="primary" size="large">
            Checkout
          </Button>
        </Box>
      ) : (
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
      )}
    </Container>
  );
};

export default Cart;