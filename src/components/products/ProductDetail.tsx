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
  TextField,
  Breadcrumbs,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [quantity, setQuantity] = useState(1);

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

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Adding ${quantity} of ${product?.title} to cart`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography>Loading...</Typography>
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

            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Quantity
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "fit-content",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 0.5,
                }}
              >
                <IconButton
                  onClick={handleDecrement}
                  size="small"
                  sx={{
                    bgcolor: "grey.100",
                    "&:hover": { bgcolor: "grey.200" },
                  }}
                >
                  <RemoveIcon />
                </IconButton>

                <TextField
                  value={quantity}
                  onChange={handleQuantityChange}
                  type="number"
                  inputProps={{
                    min: 1,
                    style: {
                      textAlign: "center",
                      width: "50px",
                      padding: "8px",
                      MozAppearance: "textfield",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                    },
                  
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                  }}
                />

                <IconButton
                  onClick={handleIncrement}
                  size="small"
                  sx={{
                    bgcolor: "grey.100",
                    "&:hover": { bgcolor: "grey.200" },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Total Price */}
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Total: ${(product.price * quantity).toFixed(2)}
            </Typography>

            <Box sx={{ mt: "auto" }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
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
                Add {quantity} to Cart
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
