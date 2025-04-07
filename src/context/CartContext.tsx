// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, Key } from "react";

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = "https://e-commerce-hfbs.onrender.com/api";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize cart on mount and token change
  useEffect(() => {
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login to continue");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const getMyCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/my_cart`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      if (data.success && data.cart?.items) {
        setCart(data.cart.items);
      } else {
        setCart([]);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const addToCart = async (item: CartItem) => {
    setLoading(true);
    try {
      // Get current cart
      const currentCartResponse = await fetch(`${API_BASE_URL}/cart/my_cart`, {
        headers: getAuthHeaders(),
      });

      if (!currentCartResponse.ok) {
        throw new Error("Failed to fetch current cart");
      }

      const currentCartData = await currentCartResponse.json();
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
      const response = await fetch(`${API_BASE_URL}/cart/add_cart`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          items: updatedItems,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

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
      const cartResponse = await fetch(`${API_BASE_URL}/cart/my_cart`, {
        headers: getAuthHeaders(),
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartData = await cartResponse.json();
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

      const response = await fetch(
        `${API_BASE_URL}/cart/delete_cart/${cartData.cart._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            items: updatedItems,
            totalPrice: updatedTotalPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

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
      const cartResponse = await fetch(`${API_BASE_URL}/cart/my_cart`, {
        headers: getAuthHeaders(),
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartData = await cartResponse.json();
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

      const response = await fetch(
        `${API_BASE_URL}/cart/update_cart/${cartData.cart._id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            items: updatedItems,
            totalPrice: updatedTotalPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

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
      const cartResponse = await fetch(`${API_BASE_URL}/cart/my_cart`, {
        headers: getAuthHeaders(),
      });

      const cartData = await cartResponse.json();
      if (!cartData.success || !cartData.cart) {
        throw new Error("Cart not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/cart/delete_cart/${cartData.cart._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

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