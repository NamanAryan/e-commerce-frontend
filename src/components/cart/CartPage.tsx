  import { Container, Card, Typography, Button, Box, IconButton } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import ClearAllIcon from '@mui/icons-material/ClearAll';
  import { useCart } from '../../context/CartContext';

  const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearAllCart } = useCart();

    return (
      <Container sx={{ py: 4 }}>
        {cart.map((item) => (
          <Card key={item.productId} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
            <img 
              src={item.image} 
              alt={item.title} 
              style={{ width: 100, objectFit: 'contain' }} 
            />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography color="primary">${item.price}</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                <Button 
                  size="small"
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                >
                  -
                </Button>
                <Typography>{item.quantity}</Typography>
                <Button 
                  size="small"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </Button>
                
                <IconButton 
                  color="error" 
                  onClick={() => removeFromCart(item.productId)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}

        {cart.length > 0 && (
          <Box sx={{ 
            mt: 4, 
            p: 3, 
            bgcolor: 'background.paper',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h5">
                Total: ${getCartTotal().toFixed(2)}
              </Typography>
              <Button
                startIcon={<ClearAllIcon />}
                color="error"
                onClick={clearAllCart}
                sx={{ mt: 1 }}
              >
                Clear Cart
              </Button>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              href='/checkout'
            >
              Checkout
            </Button>
          </Box>
        )}

        {cart.length === 0 && (
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