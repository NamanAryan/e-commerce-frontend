// src/components/categories/SpecificCategoryPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Grid, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../products/ProductCard';

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
}

const SpecificCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const categoriesResponse = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await categoriesResponse.json();
        const category = categories[Number(id) - 1];
        setCategoryName(category);

        const productsResponse = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        const data = await productsResponse.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={() => navigate('/categories')}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ 
          textTransform: 'capitalize',
          fontWeight: 600 
        }}>
          {categoryName}
        </Typography>
      </Box>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found in this category
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                description={product.description}
                image={product.image}
                rating={product.rating}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SpecificCategoryPage;