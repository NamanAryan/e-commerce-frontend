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
  Divider,
  ListItemIcon,
  Tooltip,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Logout,
  Home,
  Category,
  Inventory,
  ShoppingBag,
  AccountCircle,
  ReceiptLong,
  Favorite,
  FavoriteBorder,
  Settings,
  HelpOutline
} from "@mui/icons-material";
import { useCart } from "../../context/CartContext";

// HideOnScroll component for better mobile UX
function HideOnScroll(props: { children: any; }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    handleClose();
  };

  const handleNavigation = (path: string) => {
    handleClose();
    handleMobileMenuClose();
    navigate(path);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: "white", 
          color: "text.primary",
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
              <IconButton 
                size="large" 
                edge="start" 
                color="inherit"
                onClick={handleMobileMenuOpen}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1.5,
                    width: 220,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      left: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem onClick={() => handleNavigation('/')}>
                  <ListItemIcon>
                    <Home fontSize="small" />
                  </ListItemIcon>
                  Home
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/products')}>
                  <ListItemIcon>
                    <Inventory fontSize="small" />
                  </ListItemIcon>
                  Products
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/categories')}>
                  <ListItemIcon>
                    <Category fontSize="small" />
                  </ListItemIcon>
                  Categories
                </MenuItem>
                {isLoggedIn && (
                  <>
                    <Divider />
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/orders')}>
                      <ListItemIcon>
                        <ReceiptLong fontSize="small" />
                      </ListItemIcon>
                      My Orders
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/favorites')}>
                      <ListItemIcon>
                        <FavoriteBorder fontSize="small" />
                      </ListItemIcon>
                      Wishlist
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                      </ListItemIcon>
                      <Typography color="error">Logout</Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>

            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 2
              }}
              onClick={() => navigate('/')}
            >
              <ShoppingBag 
                color="primary" 
                sx={{ 
                  fontSize: 28, 
                  mr: 1,
                  display: { xs: 'none', sm: 'block' }
                }} 
              />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: 'primary.main',
                  textDecoration: "none",
                  cursor: 'pointer',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                SHOPEE
              </Typography>
            </Box>

            {/* Navigation - Desktop */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                gap: 1,
                ml: 3,
              }}
            >
              <Button 
                color="inherit" 
                onClick={() => navigate('/')}
                startIcon={<Home />}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } 
                }}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/products')}
                startIcon={<Inventory />}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } 
                }}
              >
                Products
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/categories')}
                startIcon={<Category />}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } 
                }}
              >
                Categories
              </Button>
            </Box>

            {/* Right Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && isLoggedIn && (
                <Tooltip title="Wishlist" arrow>
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/favorites')}
                    sx={{ 
                      mx: 1,
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                    }}
                  >
                    <FavoriteBorder />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Shopping Cart" arrow>
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/cart')}
                  sx={{ 
                    mx: 1,
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
                        minWidth: '20px',
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>

              {isLoggedIn ? (
                <Box sx={{ ml: 1 }}>
                  <Tooltip title="Account Settings" arrow>
                    <IconButton 
                      onClick={handleMenu} 
                      color="inherit"
                      sx={{ 
                        ml: 1,
                        border: '2px solid',
                        borderColor: 'primary.light',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                      }}
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
                        {user.fullName?.[0] || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 4,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                        mt: 1.5,
                        width: 220,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.fullName || 'User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email || 'user@example.com'}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/orders')}>
                      <ListItemIcon>
                        <ReceiptLong fontSize="small" />
                      </ListItemIcon>
                      My Orders
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/favorites')}>
                      <ListItemIcon>
                        <Favorite fontSize="small" />
                      </ListItemIcon>
                      My Wishlist
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/settings')}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/help')}>
                      <ListItemIcon>
                        <HelpOutline fontSize="small" />
                      </ListItemIcon>
                      Help Center
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                      </ListItemIcon>
                      <Typography color="error">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                  startIcon={<AccountCircle />}
                  sx={{
                    ml: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { 
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      bgcolor: 'primary.dark'
                    },
                    px: 3
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;