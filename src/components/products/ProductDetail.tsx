// src/components/products/ProductDetails.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCart } from "../../context/CartContext";

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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity] = useState(1);
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        productId: product.id.toString(),
        title: product.title,
        image: product.image,
        quantity: quantity,
        price: product.price,
      });

      navigate("/products");
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs and Back Button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "grey.100",
            "&:hover": { bgcolor: "grey.200" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" color="inherit">
            Home
          </Link>
          <Link href="#" color="inherit">
            {product.category}
          </Link>
          <Typography color="text.primary">{product.title}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {product.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={product.rating.rate} precision={0.1} readOnly />
              <Typography
                variant="body2"
                sx={{ ml: 1, color: "text.secondary" }}
              >
                ({product.rating.count} reviews)
              </Typography>
            </Box>

            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: 600, mb: 3 }}
            >
              ${product.price}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              {product.description}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "primary.main",
              }}
            ></Typography>

            <Box sx={{ mt: "auto" }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                disabled={cartLoading}
                sx={{
                  py: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                {cartLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Add ${quantity} to Cart`
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
