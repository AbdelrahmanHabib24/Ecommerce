import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromWishlist,
  setWishlistPopup,
} from '../../Store/Store'; // Import from store.js

const WishlistPopup = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items); // Fix: .items
  const cart = useSelector((state) => state.cart.items); // Fix: .items
  const wishlistPopup = useSelector((state) => state.popups.wishlistPopup); // Fix: from popups slice

  // Remove item from wishlist
  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
    toast.info('Item removed from wishlist!');
  };

  // Move item from wishlist to cart without removing it from wishlist
  const moveToCart = (item) => {
    if (cart.some((c) => c.id === item.id)) {
      toast.info('Item is already in your cart!');
      return;
    }
    if (!item.price) {
      toast.error('Price information is missing for this item.');
      return;
    }
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success('Added to cart!');
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    if (e.target.src !== 'https://via.placeholder.com/56?text=No+Image') {
      e.target.src = 'https://via.placeholder.com/56?text=No+Image';
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {wishlistPopup && (
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Wishlist</h2>
              <button
                onClick={() => dispatch(setWishlistPopup(false))}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-full p-1"
                aria-label="Close wishlist popup"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Wishlist Section */}
            <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Wishlist ({wishlist.length})
              </h3>
              {wishlist.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Your wishlist is empty.</p>
                  <Link
                    to="/"
                    onClick={() => dispatch(setWishlistPopup(false))}
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-sm"
                    aria-label="Shop now"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mb-4 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={item.img || 'https://via.placeholder.com/56?text=No+Image'}
                            alt={item.title}
                            className="w-14 h-14 object-fill rounded-md"
                            loading="lazy"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-medium text-gray-800 dark:text-gray-100 truncate">
                            {item.title}
                          </h4>
                          {item.price && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => moveToCart(item)}
                            className="text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded p-1"
                            aria-label={`Add ${item.title} to cart`}
                          >
                            <FaShoppingCart className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="text-red-500 hover:text-red-700 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded p-1"
                            aria-label={`Remove ${item.title} from wishlist`}
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistPopup;