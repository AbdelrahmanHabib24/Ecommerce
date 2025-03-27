import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

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
    shippingMethod: 'standard',
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const shippingFees = useMemo(() => ({
    standard: 50,
    express: 100,
  }), []);

  const shippingFee = shippingFees[billingDetails.shippingMethod];

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const discountAmount = useMemo(() => subtotal * discount, [subtotal, discount]);
  const total = useMemo(() => subtotal - discountAmount + shippingFee, [subtotal, discountAmount, shippingFee]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (!billingDetails.firstName.trim()) {
      toast.error('First name is required.', { position: 'top-right' });
      return false;
    }
    if (!billingDetails.lastName.trim()) {
      toast.error('Last name is required.', { position: 'top-right' });
      return false;
    }
    if (!billingDetails.address.trim()) {
      toast.error('Street address is required.', { position: 'top-right' });
      return false;
    }
    if (!billingDetails.townCity.trim()) {
      toast.error('Town/City is required.', { position: 'top-right' });
      return false;
    }
    if (!billingDetails.stateCounty) {
      toast.error('State/County is required.', { position: 'top-right' });
      return false;
    }
    if (!billingDetails.postcode.trim()) {
      toast.error('Postcode/ZIP is required.', { position: 'top-right' });
      return false;
    }
    if (!phoneRegex.test(billingDetails.phone)) {
      toast.error('Please enter a valid phone number (10-15 digits).', { position: 'top-right' });
      return false;
    }
    if (!emailRegex.test(billingDetails.email)) {
      toast.error('Please enter a valid email address.', { position: 'top-right' });
      return false;
    }
    return true;
  }, [billingDetails]);

  const applyCoupon = useCallback(() => {
    if (couponCode.trim() === 'DISCOUNT10') {
      setDiscount(0.1);
      setIsCouponApplied(true);
      toast.success('Coupon applied successfully! You got 10% off.', { position: 'top-right' });
    } else {
      setDiscount(0);
      setIsCouponApplied(false);
      toast.error('Invalid coupon code.', { position: 'top-right' });
    }
  }, [couponCode]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        toast.error('Your cart is empty! Please add items to proceed.', { position: 'top-right' });
        return;
      }

      if (!validateForm()) {
        return;
      }

      const confirmOrder = window.confirm(
        'Are you sure you want to place this order? Please review your details before confirming.'
      );
      if (!confirmOrder) {
        return;
      }

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
        toast.success('Order placed successfully! You will receive a confirmation email soon.', {
          position: 'top-right',
        });
      } catch (error) {
        toast.error('An error occurred while placing your order. Please try again.', {
          position: 'top-right',
        });
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
      className="bg-gray-100 min-h-screen py-6 sm:py-10"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-t-lg">
          <div className="flex flex-wrap justify-center sm:justify-between items-center text-xs sm:text-sm gap-2 sm:gap-0">
            <div className="flex space-x-2 sm:space-x-4">
              <span>SHOPPING CART</span>
              <span>→</span>
              <span className="font-bold">CHECKOUT</span>
              <span>→</span>
              <span>ORDER COMPLETE</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowCouponInput(!showCouponInput)}
            className="text-blue-500 hover:underline focus:outline-none text-sm"
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
                className="block w-full max-w-xs border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={applyCoupon}
                className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mt-4 sm:mt-6">
          {/* Your Order Section - Moved to top on mobile */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md order-first lg:order-last">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Order</h2>
            <div className="border-b pb-3 sm:pb-4 mb-3 sm:mb-4">
              <div className="flex justify-between font-semibold text-sm sm:text-base">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between mt-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                    />
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">
                      {item.title} x {item.quantity}
                    </span>
                  </div>
                  <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-sm sm:text-base">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} EGP</span>
            </div>
            {isCouponApplied && (
              <div className="flex justify-between text-green-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                <span>Discount (10%)</span>
                <span>-{discountAmount.toFixed(2)} EGP</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
              <span>Shipping Fee</span>
              <span>{shippingFee.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg mt-3 sm:mt-4">
              <span>Total</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>

          {/* Billing Details and Payment */}
          <div className="space-y-4 sm:space-y-6 flex-1">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Billing Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingDetails.firstName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingDetails.lastName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Company name (optional)
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={billingDetails.companyName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={billingDetails.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="Egypt">Egypt</option>
                      <option value="USA">USA</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={billingDetails.address}
                      onChange={handleInputChange}
                      placeholder="House number and street name"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <input
                      type="text"
                      name="apartment"
                      value={billingDetails.apartment}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="mt-2 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Town / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="townCity"
                      value={billingDetails.townCity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      State / County <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="stateCounty"
                      value={billingDetails.stateCounty}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a state</option>
                      <option value="Cairo">Cairo</option>
                      <option value="Alexandria">Alexandria</option>
                      <option value="Giza">Giza</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Postcode / ZIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={billingDetails.postcode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Order notes (optional)
                    </label>
                    <textarea
                      name="orderNotes"
                      value={billingDetails.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="3 sm:rows-4"
                    />
                  </div>

                  <div className="mt-4">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Shipping Method</h2>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={billingDetails.shippingMethod === 'standard'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 text-xs sm:text-sm text-gray-700">
                          Standard Shipping (50 EGP)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={billingDetails.shippingMethod === 'express'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 text-xs sm:text-sm text-gray-700">
                          Express Shipping (100 EGP)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment Information</h2>
              <div className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
                <p className="font-medium text-gray-700 text-sm sm:text-base">Cash on delivery</p>
                <p className="text-gray-500 mt-1 text-xs sm:text-sm">Pay with cash upon delivery.</p>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4">
                Your personal data will be used to process your order, support your experience
                throughout this website, and for other purposes described in our{' '}
                <Link to="/privacy-policy" className="text-blue-500 hover:underline">
                  privacy policy
                </Link>
                .
              </p>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full mt-4 sm:mt-6 bg-blue-600 text-white py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Processing...</span>
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