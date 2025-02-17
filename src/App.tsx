import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Products from "./components/products/ProductList";
import Layout from "./components/common/layout";
import "./index.css";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import Home from "./components/products/Home";
import ProductDetails from "./components/products/ProductDetail";
import { useEffect, useState } from "react";
import Cart from "./components/cart/CartPage";
import CategoryPage from "./components/categories/CategoryPage";
import SpecificCategoryPage from "./components/categories/SpecificCategoryPage";
import ProfilePage from "./components/profile/ProfilePage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import OrderConfirmation from "./components/checkout/OrderConfirm";
import OrdersPage from "./components/orders/OrderPage";

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const isExpired = decodedToken.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return <>{children}</>;
};

// Main App Component
const App = () => {
  return (
    <Router>
      <CartProvider>
        <SearchProvider>
          <Layout>
            <ErrorBoundary>
              <Routes>
                <Route
                  path="/login"
                  element={
                    localStorage.getItem("token") ? (
                      <Navigate to="/" />
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    localStorage.getItem("token") ? (
                      <Navigate to="/" />
                    ) : (
                      <Register />
                    )
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Outlet />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="categories" element={<CategoryPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="/category/:id" element={<SpecificCategoryPage />} />
                  <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </Layout>
        </SearchProvider>
      </CartProvider>
    </Router>
  );
};

export default App;
