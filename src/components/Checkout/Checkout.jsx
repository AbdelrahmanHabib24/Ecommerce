/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaSpinner ,FaTrash } from 'react-icons/fa';

// Constants
const COUPON_CODES = {
  DISCOUNT10: 0.1, // 10% discount
};

const Checkout = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'Egypt',
    address: '',
    apartment: '',
    townCity: '',
    stateCounty: '',
    postcode: '',
    phone: '',
    email: '',
    orderNotes: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Function to remove an item from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Function to update the quantity of an item
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Detailed logging for debugging
  console.log('Cart Data:', cart);
  console.log('Cart Length:', cart.length);
  console.log('Cart Items:', cart.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    img: item.img,
  })));

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0), [cart]);
  const discountAmount = useMemo(() => subtotal * discount, [subtotal, discount]);
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]); // Removed shippingFee

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateField = (field, value, regex = null, required = true) => {
    if (required && !value.trim()) return `${field} is required.`;
    if (regex && !regex.test(value)) return `Please enter a valid ${field.toLowerCase()}.`;
    return null;
  };

  const validateForm = useCallback(() => {
    const validations = [
      validateField('First name', billingDetails.firstName),
      validateField('Last name', billingDetails.lastName),
      validateField('Street address', billingDetails.address),
      validateField('Town/City', billingDetails.townCity),
      validateField('State/County', billingDetails.stateCounty),
      validateField('Postcode/ZIP', billingDetails.postcode),
      validateField('Phone', billingDetails.phone, /^\+?\d{10,15}$/),
      validateField('Email', billingDetails.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ];

    const errors = validations.filter(Boolean);
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error, { position: 'top-right' }));
      return false;
    }
    return true;
  }, [billingDetails]);

  const applyCoupon = useCallback(() => {
    const discount = COUPON_CODES[couponCode.trim()] || 0;
    setDiscount(discount);
    setIsCouponApplied(discount > 0);
    toast[discount > 0 ? 'success' : 'error'](
      discount > 0
        ? `Coupon applied successfully! You got ${discount * 100}% off.`
        : 'Invalid coupon code.',
      { position: 'top-right' }
    );
  }, [couponCode]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        toast.error('Your cart is empty! Please add items to proceed.', { position: 'top-right' });
        return;
      }

      if (!validateForm()) return;

      const confirmOrder = window.confirm('Are you sure you want to place this order?');
      if (!confirmOrder) return;

      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const orderNumber = Math.floor(Math.random() * 10000) + 1000;

        navigate('/order-complete', {
          state: {
            orderNumber,
            cart,
            billingDetails,
            total,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          },
        });

        setCart([]);
        toast.success('Order placed successfully! Check your email for confirmation.', {
          position: 'top-right',
        });
      } catch (error) {
        toast.error('An error occurred. Please try again.', { position: 'top-right' });
      } finally {
        setIsLoading(false);
      }
    },
    [cart, validateForm, billingDetails, setCart, navigate, total]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 min-h-screen py-6 sm:py-10 text-gray-900 dark:text-gray-100"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-t-lg">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span>SHOPPING CART</span>
            <span className="font-bold">CHECKOUT</span>
            <span>ORDER COMPLETE</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowCouponInput(!showCouponInput)}
            className="text-blue-500 dark:text-blue-400 hover:underline focus:outline-none text-sm"
          >
            Have a coupon? Click here to enter your code
          </button>
          {showCouponInput && (
            <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                disabled={isLoading}
                className="block w-full max-w-xs border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={applyCoupon}
                disabled={isLoading}
                className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mt-6">
          <div className="bg-white dark:bg-gray-800 max-h-max p-6 rounded-lg shadow-md order-first lg:order-last lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Order</h2>
            <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
              <div className="flex justify-between font-semibold text-base text-gray-900 dark:text-gray-100">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your cart is empty.</p>
              ) : (
                cart.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between gap-4 mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                   
                      <img
                        src={item.img || 'https://via.placeholder.com/48'}
                        alt={item.title || 'Product Image'}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/48')}
                      />
                      <div className="flex flex-col ">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
  {(item.title || 'Unknown Product').length > 20
    ? `${(item.title || 'Unknown Product').substring(0, 25)}…`
    : item.title || 'Unknown Product'}
</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-gray-800 dark:text-gray-200">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="border  border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                          <button
  onClick={() => removeFromCart(item.id)}
  className="text-gray-500  dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
  aria-label={`Remove ${item.title || 'product'} from cart`}
>
  <FaTrash className="w-4 h-4" />
</button>
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {((item.price || 0) * (item.quantity || 1)).toFixed(2)} EGP
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between font-semibold text-base text-gray-900 dark:text-gray-100">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Billing Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={billingDetails.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={billingDetails.lastName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company name (optional)
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={billingDetails.companyName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={billingDetails.country}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    >
                      <option value="Egypt">Egypt</option>
                      <option value="USA">USA</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={billingDetails.address}
                      onChange={handleInputChange}
                      placeholder="House number and street name"
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    />
                    <input
                      id="apartment"
                      type="text"
                      name="apartment"
                      value={billingDetails.apartment}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      disabled={isLoading}
                      className="mt-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="townCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Town / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="townCity"
                      type="text"
                      name="townCity"
                      value={billingDetails.townCity}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="stateCounty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State / County <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="stateCounty"
                      name="stateCounty"
                      value={billingDetails.stateCounty}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    >
                      <option value="">Select a state</option>
                      <option value="Cairo">Cairo</option>
                      <option value="Alexandria">Alexandria</option>
                      <option value="Giza">Giza</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Postcode / ZIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      name="postcode"
                      value={billingDetails.postcode}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Order notes (optional)
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={billingDetails.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      disabled={isLoading}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows="4"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Payment Information</h2>
              <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                <p className="font-medium text-gray-700 dark:text-gray-200 text-base">Cash on Delivery</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Pay with cash upon delivery.</p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                Your personal data will be used to process your order, support your experience
                throughout this website, and for other purposes described in our{' '}
                <Link to="/privacy-policy" className="text-blue-500 dark:text-blue-400 hover:underline">
                  privacy policy
                </Link>
                .
              </p>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full mt-6 bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 text-base ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5" />
                    <span>Processing Your Order...</span>
                  </>
                ) : (
                  <span>Place Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

Checkout.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      img: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      stockQuantity: PropTypes.number,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
};

export default Checkout;