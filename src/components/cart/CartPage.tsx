import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearAllCart, refreshCart } = useCart() as unknown as {
    cart: { productId: number; image: string; title: string; price: number; quantity: number }[];
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    getCartTotal: () => number;
    clearAllCart: () => void;
    refreshCart: () => Promise<void>;
  };
  const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize backend ping on mount
  useEffect(() => {
    // Create a ping function to keep backend awake
    const keepBackendAlive = () => {
      setInterval(() => {
        axios.get('https://e-commerce-hfbs.onrender.com/api/health')
          .catch(err => console.log('Ping error (can be ignored):', err));
      }, 10 * 60 * 1000); // 10 minutes
    };

    keepBackendAlive();
    
    // Try to refresh cart on component mount
    const tryRefreshCart = async () => {
      setIsLoading(true);
      try {
        await refreshCart();
      } catch (error) {
        console.error('Failed to refresh cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    tryRefreshCart();
  }, [refreshCart]);

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      // Trigger animation
      setIsAnimating(prev => ({ ...prev, [productId]: true }));
      // Update quantity
      updateQuantity(String(productId), newQuantity);
      // Reset animation after a delay
      setTimeout(() => {
        setIsAnimating(prev => ({ ...prev, [productId]: false }));
      }, 300);
    }
  };

  const handleRemoveItem = (productId: number) => {
    // Animate before removal
    setIsAnimating(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      removeFromCart(String(productId));
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Your Shopping Cart
            </h1>
            <p className="mt-3 text-lg">
              {isLoading ? "Loading your cart..." : 
                cart.length > 0 
                  ? `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`
                  : "Your cart is empty"}
            </p>
          </div>
        </div>
        {/* Wave Separator */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50 fill-current" viewBox="0 0 1440 48">
            <path d="M0 48h1440V0c-196 23-432 38-720 38C432 38 196 23 0 0v48z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-indigo-600 animate-spin mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900">Loading your cart</h2>
            <p className="text-gray-600 mt-2">Please wait while we fetch your cart items...</p>
          </div>
        ) : cart.length > 0 ? (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-100 text-gray-600 text-sm font-medium">
                <div className="md:col-span-6">Product</div>
                <div className="md:col-span-2 text-center">Price</div>
                <div className="md:col-span-2 text-center">Quantity</div>
                <div className="md:col-span-2 text-center">Subtotal</div>
              </div>

              {cart.map((item) => (
                <div 
                  key={item.productId} 
                  className={`border-b border-gray-200 transition-all duration-300 ${
                    isAnimating[item.productId] ? 'opacity-50 scale-98' : 'opacity-100'
                  }`}
                >
                  {/* Mobile View */}
                  <div className="md:hidden p-4 flex flex-col space-y-3">
                    <div className="flex space-x-4">
                      <div className="bg-gray-100 rounded-md p-2 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-medium line-clamp-2">{item.title}</h3>
                        <p className="text-indigo-600 font-bold mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                          <button
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 items-center">
                    <div className="md:col-span-6 flex items-center space-x-4">
                      <div className="bg-gray-100 rounded-md p-2 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <h3 className="text-gray-800 font-medium line-clamp-2">{item.title}</h3>
                    </div>
                    <div className="md:col-span-2 text-center text-gray-800 font-medium">
                      {formatPrice(item.price)}
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                        <button
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <span className="font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 mb-6 lg:mb-0">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Special Instructions</h3>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add any special instructions or notes for your order..."
                    rows={3}
                  ></textarea>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => navigate('/products')}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Continue Shopping
                    </button>
                    
                    <button
                      onClick={clearAllCart}
                      className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(getCartTotal())}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;