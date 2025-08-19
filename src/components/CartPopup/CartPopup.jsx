import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaPlus, FaMinus, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartQuantity, removeFromCart, clearCart } from '../../reducers/cartReducer';
import { setCartPopup } from '../../reducers/popupsReducer';



const CartPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartPopup = useSelector((state) => state.popups.cartPopup);
  const cart = useSelector((state) => state.cart.items);
  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0), [cart]);

  const closePopup = useCallback(() => dispatch(setCartPopup(false)), [dispatch]);

  const handleRemove = useCallback((id, title) => {
    if (window.confirm(`Remove "${title || 'item'}" from cart?`)) {
      dispatch(removeFromCart(id));
      toast.info('Item removed!');
    }
  }, [dispatch]);

  const handleClear = useCallback(() => {
    if (cart.length === 0) return toast.info('Cart is empty.');
    if (window.confirm('Clear cart?')) {
      dispatch(clearCart());
      toast.info('Cart cleared!');
    }
  }, [cart, dispatch]);

  const updateQuantity = useCallback((id, change, stock) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = (item.quantity || 1) + change;
    if (newQty < 1) return handleRemove(id, item.title);
    if (stock && newQty > stock) return toast.error(`Only ${stock} left!`);
    dispatch(updateCartQuantity({ id, quantity: newQty }));
  }, [cart, dispatch, handleRemove]);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return toast.error('Cart is empty.');
    setIsCheckingOut(true);
    setTimeout(() => {
      toast.success('Proceeding to checkout...');
      dispatch(setCartPopup(false));
      setIsCheckingOut(false);
      navigate('/checkout');
    }, 1000);
  }, [cart, dispatch, navigate]);

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.2 } } };
  const buttonVariants = { hover: { scale: 1.05, transition: { duration: 0.2 } }, tap: { scale: 0.95, transition: { duration: 0.2 } } };

  return (
    <>
      <AnimatePresence>
        {cartPopup && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black z-40" onClick={closePopup} />}
      </AnimatePresence>

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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Cart ({cart.length})</h2>
                <motion.button onClick={closePopup} whileHover="hover" whileTap="tap" variants={buttonVariants} className="p-1 rounded-full">
                  <FaTimes className="w-6 h-6" />
                </motion.button>
              </div>

              <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Your cart is empty.</p>
                    <Link to="/" onClick={closePopup} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">Shop Now</Link>
                  </div>
                ) : (
                  <>
                    <AnimatePresence>
                      {cart.map((item, index) => (
                        <motion.div key={`${item.id}-${index}`} variants={itemVariants} initial="hidden" animate="visible" exit="exit" className="mb-4 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.title} className="w-14 h-14 object-fill rounded-md" loading="lazy" onError={(e) => (e.target.src = 'https://via.placeholder.com/56x56?text=No+Image')} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-medium truncate">{item.title}</h4>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <motion.button onClick={() => updateQuantity(item.id, -1, item.stockQuantity)} whileHover="hover" whileTap="tap" variants={buttonVariants}><FaMinus className="w-4 h-4" /></motion.button>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.quantity || 1}</span>
                                  <motion.button onClick={() => updateQuantity(item.id, 1, item.stockQuantity)} whileHover="hover" whileTap="tap" variants={buttonVariants}><FaPlus className="w-4 h-4" /></motion.button>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">${(item.price || 0).toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <motion.button onClick={() => toast.info(`${item.title} saved for later!`)} whileHover="hover" whileTap="tap" variants={buttonVariants} className="text-purple-500 p-1"><FaHeart className="w-5 h-5" /></motion.button>
                              <motion.button onClick={() => handleRemove(item.id, item.title)} whileHover="hover" whileTap="tap" variants={buttonVariants} className="text-red-500 p-1"><FaTrash className="w-5 h-5" /></motion.button>
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
                        <motion.button onClick={handleClear} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm" whileHover="hover" whileTap="tap" variants={buttonVariants}>Clear Cart</motion.button>
                        <motion.button onClick={handleCheckout} disabled={isCheckingOut} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm relative" whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          {isCheckingOut ? 'Processing...' : 'Checkout'}
                        </motion.button>
                      </div>
                      <motion.button onClick={closePopup} className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors text-sm" whileHover="hover" whileTap="tap" variants={buttonVariants}>Continue Shopping</motion.button>
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

export default CartPopup;
