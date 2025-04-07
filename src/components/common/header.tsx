// src/components/layout/Header.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Button,
  Container,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", checkAuth);
    window.addEventListener("login", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("login", checkAuth);
    };
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    handleClose();
    navigate(path);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: "white", 
        color: "black",
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: { xs: 1, md: 0 },
              cursor: 'pointer'
            }}
          >
            SHOPEE
          </Typography>

          {/* Navigation - Desktop */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 2,
              ml: 4,
            }}
          >
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/products')}
              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } }}
            >
              Products
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/categories')}
              sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } }}
            >
              Categories
            </Button>
          </Box>

          {/* Right Icons */}
          

            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              sx={{ 
                position: 'relative',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
              }}
            >
              <Badge 
                badgeContent={cartItemCount} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: '20px',
                    minWidth: '20px'
                  }
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isLoggedIn ? (
              <Box>
                <IconButton 
                  onClick={handleMenu} 
                  color="inherit"
                  sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } }}
                >
                  <Avatar
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: "primary.main",
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    {user.fullName?.[0]}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <Person sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/orders')}>
                    <ShoppingCart sx={{ mr: 1 }} /> Orders
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ color: 'error.main' }}
                  >
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { 
                    boxShadow: "none",
                    bgcolor: 'primary.dark'
                  },
                  px: 3
                }}
              >
                Login
              </Button>
            )}
      
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;