/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaPlus, FaMinus, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';

// Utility function to clean image URLs
const cleanImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/56x56?text=No+Image';
  let url = image;
  if (Array.isArray(image)) {
    url = image[0] || '';
  }
  url = url.replace(/^\["|"\]$/g, '').replace(/\\"/g, '').trim();
  return url || 'https://via.placeholder.com/56x56?text=No+Image';
};

const CartPopup = ({ cartPopup, setCartPopup, cart, setCart, setWishlistPopup, wishlist, setWishlist }) => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Remove item from cart
  const handleRemoveFromCart = useCallback((id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title || 'this item'}" from your cart?`)) {
      setCart(cart.filter((item) => item.id !== id));
      toast.info('Item removed from cart!');
    }
  }, [cart, setCart]);

  // Clear all items from cart
  const handleClearCart = useCallback(() => {
    if (cart.length === 0) {
      toast.info('Your cart is already empty.');
      return;
    }
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
      toast.info('Cart cleared!');
    }
  }, [cart, setCart]);

  // Move item to wishlist (Save for Later)
  const handleSaveForLater = useCallback((item) => {
    if (wishlist.some((w) => w.id === item.id)) {
      toast.info('Item is already in your wishlist!');
      return;
    }
    setWishlist([...wishlist, { ...item, quantity: undefined }]);
    setCart(cart.filter((i) => i.id !== item.id));
    toast.success('Item saved to wishlist!');
  }, [cart, setCart, wishlist, setWishlist]);

  // Update quantity in cart
  const updateQuantity = useCallback((id, change, stockQuantity) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQuantity = (item.quantity || 1) + change;
          if (newQuantity < 1) {
            handleRemoveFromCart(id, item.title);
            return item;
          }
          if (stockQuantity && newQuantity > stockQuantity) {
            toast.error(`Only ${stockQuantity} items available in stock!`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, [cart, setCart, handleRemoveFromCart]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Button animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {cartPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setCartPopup(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {cartPopup && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Cart ({cart.length})</h2>
                <motion.button
                  onClick={() => setCartPopup(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-full p-1"
                  aria-label="Close cart popup"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <FaTimes className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Cart Section */}
              <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Your cart is empty.</p>
                    <Link
                      to="/"
                      onClick={() => setCartPopup(false)}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm"
                      aria-label="Shop now"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <>
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mb-4 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            {/* Image */}
                            <div className="flex-shrink-0 relative">
                              <img
                                src={cleanImageUrl(item.img)}
                                alt={item.title || 'Item'}
                                className="w-14 h-14 object-cover rounded-md"
                                loading="lazy"
                                onError={(e) => (e.target.src = 'https://via.placeholder.com/56x56?text=No+Image')}
                              />
                            </div>
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-medium text-gray-800 dark:text-gray-100 truncate">
                                {item.title || 'Untitled Item'}
                              </h4>
                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    onClick={() => updateQuantity(item.id, -1, item.stockQuantity)}
                                    className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded"
                                    aria-label={`Decrease quantity of ${item.title || 'item'} (current: ${item.quantity || 1})`}
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonVariants}
                                  >
                                    <FaMinus className="w-4 h-4" />
                                  </motion.button>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.quantity || 1}</span>
                                  <motion.button
                                    onClick={() => updateQuantity(item.id, 1, item.stockQuantity)}
                                    className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded"
                                    aria-label={`Increase quantity of ${item.title || 'item'} (current: ${item.quantity || 1})`}
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonVariants}
                                  >
                                    <FaPlus className="w-4 h-4" />
                                  </motion.button>
                                </div>
                                {/* Price */}
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  ${(item.price || 0).toFixed(2)}
                                </span>
                              </div>
                              {item.stockQuantity && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {item.stockQuantity <= 5 ? `Only ${item.stockQuantity} left in stock!` : `${item.stockQuantity} in stock`}
                                  </p>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div
                                      className={`h-1.5 rounded-full ${
                                        item.stockQuantity <= 5 ? 'bg-red-500' : 'bg-green-500'
                                      }`}
                                      style={{
                                        width: `${Math.min((item.stockQuantity / 50) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <motion.button
                                onClick={() => handleSaveForLater(item)}
                                className="text-purple-500 hover:text-purple-700 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 rounded p-1"
                                aria-label={`Save ${item.title || 'item'} for later`}
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                              >
                                <FaHeart className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleRemoveFromCart(item.id, item.title)}
                                className="text-red-500 hover:text-red-700 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded p-1"
                                aria-label={`Remove ${item.title || 'item'} from cart`}
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                              >
                                <FaTrash className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100 text-base mb-4">
                        <span>Subtotal:</span>
                        <span>${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleClearCart}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-sm"
                          aria-label="Clear cart"
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          Clear Cart
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            if (cart.length === 0) {
                              toast.error('Your cart is empty. Add some items to proceed to checkout.');
                              return;
                            }
                            setIsCheckingOut(true);
                            setTimeout(() => {
                              toast.success('Proceeding to checkout...');
                              setCartPopup(false);
                              setIsCheckingOut(false);
                              navigate('/checkout');
                            }, 1000);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm relative"
                          aria-label="Proceed to checkout"
                          disabled={isCheckingOut}
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          {isCheckingOut ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            'Checkout'
                          )}
                        </motion.button>
                      </div>
                      <motion.button
                        onClick={() => setCartPopup(false)}
                        className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
                        aria-label="Continue shopping"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  </>
                )}
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

CartPopup.propTypes = {
  cartPopup: PropTypes.bool.isRequired,
  setCartPopup: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
      img: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      stockQuantity: PropTypes.number,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
  setWishlistPopup: PropTypes.func,
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      img: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      price: PropTypes.number,
    })
  ).isRequired,
  setWishlist: PropTypes.func.isRequired,
};

export default CartPopup;