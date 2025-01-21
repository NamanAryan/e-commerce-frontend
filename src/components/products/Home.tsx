// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Card,
  CardMedia,
  CardContent,
  Rating,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentsIcon from '@mui/icons-material/Payments';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  category: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        // Randomly select a product
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setFeaturedProduct(randomProduct);
      } catch (error) {
        console.error('Error fetching featured product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Discover Amazing Products
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Shop the latest trends with unbeatable prices
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/products')}
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Shop Now
              </Button>
            </Grid>
          </Grid>
        </Container>
        
        {/* Decorative background elements */}
        <Box 
          sx={{
            position: 'absolute',
            right: -100,
            top: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)'
          }}
        />
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            { icon: <LocalShippingIcon sx={{ fontSize: 40 }} />, title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: <SupportAgentIcon sx={{ fontSize: 40 }} />, title: '24/7 Support', desc: 'Get help anytime' },
            { icon: <PaymentsIcon sx={{ fontSize: 40 }} />, title: 'Secure Payments', desc: 'Shop with confidence' },
            { icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />, title: 'Easy Returns', desc: '30-day return policy' }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Product Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Featured Product
          </Typography>

          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : featuredProduct && (
            <Card 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                overflow: 'hidden',
                boxShadow: 3,
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => navigate(`/product/${featuredProduct.id}`)}
            >
              <Box 
                sx={{ 
                  width: { xs: '100%', md: '50%' },
                  p: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'white'
                }}
              >
                <CardMedia
                  component="img"
                  image={featuredProduct.image}
                  alt={featuredProduct.title}
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain'
                  }}
                />
              </Box>
              
              <CardContent 
                sx={{ 
                  width: { xs: '100%', md: '50%' },
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography 
                  variant="overline" 
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  Featured Product
                </Typography>
                <Typography 
                  variant="h4" 
                  component="h3"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  {featuredProduct.title}
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {featuredProduct.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Rating value={featuredProduct.rating.rate} readOnly />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    ({featuredProduct.rating.count} reviews)
                  </Typography>
                </Box>

                <Typography 
                  variant="h5" 
                  color="primary"
                  sx={{ mb: 3, fontWeight: 600 }}
                >
                  ${featuredProduct.price}
                </Typography>

                <Button 
                  variant="contained" 
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;