// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, Key } from "react";
import api from './api'; // Ensure this is an Axios instance or similar HTTP client

interface CartItem {
  id?: Key | null | undefined;  
  name?: ReactNode;             
  productId: string;           
  title: string;               
  image: string;               
  quantity: number;             
  price: number;              
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getCartTotal: () => number;
  clearCart: () => void;
  getMyCart: () => Promise<void>;
  clearAllCart: () => Promise<void>;
  refreshCart: () => Promise<any>; // Added refreshCart to interface
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize backend keep-alive on component mount
  useEffect(() => {
    // Import here to avoid circular dependencies
    const { keepBackendAlive } = require('./api');
    keepBackendAlive();
    
    const token = localStorage.getItem("token");
    if (token) {
      getMyCart();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (e.newValue) {
          getMyCart();
        } else {
          setCart([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    const errorMessage = error?.response?.data?.message || error.message || "An error occurred";
    alert(errorMessage); // Using alert instead of toast for now
  };

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart/my_cart');
      
      if (response.data.success && response.data.cart?.items) {
        setCart(response.data.cart.items);
      } else {
        setCart([]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing cart:', error);
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const getMyCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart/my_cart');
      
      if (response.data.success && response.data.cart?.items) {
        setCart(response.data.cart.items);
      } else {
        setCart([]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    setLoading(true);
    try {
      // Get current cart
      const currentCartResponse = await api.get('/cart/my_cart');

      const currentCartData = currentCartResponse.data;
      const currentItems = currentCartData.success && currentCartData.cart 
        ? currentCartData.cart.items 
        : [];

      // Check if item exists
      const existingItemIndex = currentItems.findIndex(
        (i: { productId: string }) => i.productId === item.productId.toString()
      );

      let updatedItems;
      if (existingItemIndex !== -1) {
        updatedItems = currentItems.map((currentItem: CartItem, index: number) => {
          if (index === existingItemIndex) {
            return {
              ...currentItem,
              quantity: currentItem.quantity + 1,
            };
          }
          return currentItem;
        });
      } else {
        updatedItems = [...currentItems, { ...item, quantity: 1 }];
      }

      const totalPrice = updatedItems.reduce(
        (sum: number, i: CartItem) => sum + i.price * i.quantity,
        0
      );

      // Update cart on server
      await api.post('/cart/add_cart', {
        items: updatedItems,
        totalPrice,
      });

      await getMyCart();
      console.log("Item added to cart successfully");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      const cartResponse = await api.get('/cart/my_cart');

      const cartData = cartResponse.data;
      if (!cartData.success || !cartData.cart) {
        throw new Error("Cart not found");
      }

      const updatedItems = cartData.cart.items.filter(
        (item: CartItem) => item.productId !== productId
      );

      const updatedTotalPrice = updatedItems.reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
      );

      await api.delete(`/cart/delete_cart/${cartData.cart._id}`, {
        data: {
          items: updatedItems,
          totalPrice: updatedTotalPrice,
        }
      });

      setCart(updatedItems);
      console.log("Item removed from cart");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      alert("Quantity cannot be less than 1");
      return;
    }

    setLoading(true);
    try {
      const cartResponse = await api.get('/cart/my_cart');

      const cartData = cartResponse.data;
      if (!cartData.success || !cartData.cart) {
        throw new Error("Cart not found");
      }

      const updatedItems = cartData.cart.items.map((item: CartItem) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      const updatedTotalPrice = updatedItems.reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
      );

      await api.patch(`/cart/update_cart/${cartData.cart._id}`, {
        items: updatedItems,
        totalPrice: updatedTotalPrice,
      });

      setCart(updatedItems);
      console.log("Cart updated");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllCart = async () => {
    setLoading(true);
    try {
      const cartResponse = await api.get('/cart/my_cart');

      const cartData = cartResponse.data;
      if (!cartData.success || !cartData.cart) {
        throw new Error("Cart not found");
      }

      await api.delete(`/cart/delete_cart/${cartData.cart._id}`);

      setCart([]);
      console.log("Cart cleared");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => 
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
        getMyCart,
        clearAllCart,
        refreshCart  // Added refreshCart to the context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export default CartContext;