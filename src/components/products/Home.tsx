// src/pages/Home.tsx
import { useState, useEffect } from "react";
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
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentsIcon from "@mui/icons-material/Payments";

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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const products: Product[] = await response.json();
        // Randomly select two products
        const randomProducts: Product[] = [];
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * products.length);
          randomProducts.push(products[randomIndex]);
          products.splice(randomIndex, 1);
        }
        setFeaturedProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
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
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Discover Amazing Products
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                }}
              >
                Shop the latest trends with unbeatable prices
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/products")}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
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
            position: "absolute",
            right: -100,
            top: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            {
              icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
              title: "Free Shipping",
              desc: "On orders over $100",
            },
            {
              icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
              title: "24/7 Support",
              desc: "Get help anytime",
            },
            {
              icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
              title: "Secure Payments",
              desc: "Shop with confidence",
            },
            {
              icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
              title: "Easy Returns",
              desc: "30-day return policy",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
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

      {/* Featured Products Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{ mb: 6, fontWeight: 600 }}
          >
            Featured Products
          </Typography>

          <Grid container spacing={4}>
            {loading ? (
              <>
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="rectangular" height={400} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="rectangular" height={400} />
                </Grid>
              </>
            ) : (
              featuredProducts.map((product: Product) => (
                <Grid item xs={12} sm={6} key={product.id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      boxShadow: 3,
                      cursor: "pointer",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        p: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "white",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.title}
                        sx={{
                          width: "100%",
                          maxHeight: 400,
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
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
                        variant="h5"
                        component="h3"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        {product.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3 }}>
                        {product.description}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Rating value={product.rating.rate} readOnly />
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, color: "text.secondary" }}
                        >
                          ({product.rating.count} reviews)
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ mb: 3, fontWeight: 600 }}
                      >
                        ${product.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
