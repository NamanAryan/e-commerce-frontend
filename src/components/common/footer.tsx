// src/components/layout/Footer.tsx
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider
  } from '@mui/material';
  import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Email,
    Phone,
    LocationOn
  } from '@mui/icons-material';
  
  const Footer = () => {
    return (
      <Box
        sx={{
          bgcolor: 'white',
          color: 'text.secondary',
          py: 6,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                About SHOPEE
              </Typography>
              <Typography variant="body2" mb={2}>
                We provide high-quality products at competitive prices. Our mission is to make 
                online shopping easy, secure, and enjoyable for everyone.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="inherit" size="small">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <Twitter />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <Instagram />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <LinkedIn />
                </IconButton>
              </Box>
            </Grid>
  
            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/" color="inherit" underline="hover">Home</Link>
                <Link href="/products" color="inherit" underline="hover">Products</Link>
                <Link href="/cart" color="inherit" underline="hover">Cart</Link>
                <Link href="/orders" color="inherit" underline="hover">My Orders</Link>
                <Link href="#" color="inherit" underline="hover">Privacy Policy</Link>
                <Link href="#" color="inherit" underline="hover">Terms & Conditions</Link>
              </Box>
            </Grid>
  
            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="inherit" />
                  <Typography variant="body2">
                    123 Shopping Street, NY 10001, USA
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone color="inherit" />
                  <Typography variant="body2">
                    +1 234 567 8900
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email color="inherit" />
                  <Typography variant="body2">
                    support@shopee.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
  
          <Divider sx={{ mt: 6, mb: 4 }} />
  
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SHOPEE. All rights reserved.
          </Typography>
        </Container>
      </Box>
    );
  };
  
  export default Footer;