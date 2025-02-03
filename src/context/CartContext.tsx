import { createContext, useContext, useState } from "react";

interface CartItem {
  productId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getCartTotal: () => number;
  clearCart: () => void;
  getMyCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const getMyCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://e-commerce-hfbs.onrender.com/api/cart/my_cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success && data.cart?.items) {
        setCart(data.cart.items);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      const token = localStorage.getItem("token");

      const cartData = {
        items: [
          {
            productId: item.productId,
            title: item.title,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          },
        ],
        totalPrice: item.price * item.quantity,
      };

      const response = await fetch(
        "https://e-commerce-hfbs.onrender.com/api/cart/add_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Add to cart failed");
      }

      // Instead of adding directly to state, fetch updated cart
      await getMyCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      // First get the current cart
      const cartResponse = await fetch('https://e-commerce-hfbs.onrender.com/api/cart/my_cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const cartData = await cartResponse.json();
      if (!cartData.success || !cartData.cart) {
        throw new Error('Cart not found');
      }

      const updatedItems = cartData.cart.items.filter((item: { productId: string; }) => item.productId !== productId);
      const updatedTotalPrice = updatedItems.reduce((total: number, item: { price: number; quantity: number; }) => total + (item.price * item.quantity), 0);

      const updateResponse = await fetch(`https://e-commerce-hfbs.onrender.com/api/cart/delete_cart/${cartData.cart._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: updatedItems,
          totalPrice: updatedTotalPrice
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to remove item');
      }

      // Update local state
      setCart(updatedItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
};

const updateQuantity = async (productId: string, newQuantity: number) => {
  try {
    const token = localStorage.getItem('token');
    const cartResponse = await fetch('https://e-commerce-hfbs.onrender.com/api/cart/my_cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const cartData = await cartResponse.json();
    if (!cartData.success || !cartData.cart) {
      throw new Error('Cart not found');
    }

    // Update quantity in items array
    const updatedItems = cartData.cart.items.map((item: { productId: string; }) => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );

    // Calculate new total price
    const updatedTotalPrice = updatedItems.reduce(
      (total: number, item: { price: number; quantity: number; }) => total + (item.price * item.quantity), 
      0
    );

    const response = await fetch(
      `https://e-commerce-hfbs.onrender.com/api/cart/update_cart/${cartData.cart._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: updatedItems,
          totalPrice: updatedTotalPrice
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    // Update local state after successful server update
    setCart(updatedItems);
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};
  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
        getMyCart,
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

export { CartContext };