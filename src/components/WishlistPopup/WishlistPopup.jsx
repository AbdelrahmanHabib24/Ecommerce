import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../reducers/cartReducer";
import { removeFromWishlist } from "../../reducers/wishlistReducer";
import { setWishlistPopup } from "../../reducers/popupsReducer";

const WishlistPopup = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isOpen = useSelector((state) => state.popups.wishlistPopup);

  const closePopup = () => dispatch(setWishlistPopup(false));

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.info("Item removed from wishlist!");
  };

  const handleAddToCart = (item) => {
    if (!item.price) return toast.error("Missing price.");
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success("Added to cart!");
  };

  

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto"
        >
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Wishlist
              </h2>
              <button
                onClick={closePopup}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-1"
                aria-label="Close wishlist"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Wishlist ({wishlist.length})
              </h3>

              {wishlist.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Your wishlist is empty.
                  </p>
                  <Link
                    to="/"
                    onClick={closePopup}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemAnimation}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mb-4 p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image }
                          alt={item.title}
                          className="w-14 h-14 object-fill rounded-md"
                          loading="lazy"
                        />
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
                            onClick={() => handleAddToCart(item)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            aria-label="Add to cart"
                          >
                            <FaShoppingCart className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Remove from wishlist"
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
