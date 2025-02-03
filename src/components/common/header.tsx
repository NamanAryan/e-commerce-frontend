// src/components/layout/Header.tsx
import { useEffect, useState } from "react";
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
  Favorite,
  Logout,
} from "@mui/icons-material";

const Header = () => {
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
    window.location.href = "/login";
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", color: "black" }}>
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
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: { xs: 1, md: 0 },
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
            <Button color="inherit" href="/">
              Home
            </Button>
            <Button color="inherit" href="/products">
              Products
            </Button>
            <Button color="inherit" href="/categories">
              Categories
            </Button>
          </Box>

          {/* Right Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="primary">
                <Favorite />
              </Badge>
            </IconButton>

            <IconButton color="inherit" href="/cart">
              <Badge badgeContent={0} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isLoggedIn ? (
              <Box>
                <IconButton onClick={handleMenu} color="inherit">
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                    {user.fullName?.[0]}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Person sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ShoppingCart sx={{ mr: 1 }} /> Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="contained"
                href="/login"
                sx={{
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
