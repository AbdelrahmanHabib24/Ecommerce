/* eslint-disable no-unused-vars */
import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSpinner, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import { setCart, clearCart } from "../../reducers/cartReducer";

// Constants
const COUPON_CODES = { DISCOUNT10: 0.1 };
const FALLBACK_IMAGE = "https://picsum.photos/180/220";
const CATEGORY_IMAGES = {
  electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=180&h=220&fit=crop",
  jewelery: "https://images.unsplash.com/photo-1606760227091-3dd44d7d1e44?q=80&w=180&h=220&fit=crop",
  "men's clothing": "https://images.unsplash.com/photo-1593032465175-4e37b22e72d7?q=80&w=180&h=220&fit=crop",
  "women's clothing": "https://images.unsplash.com/photo-1593032465175-4e37b22e72d7?q=80&w=180&h=220&fit=crop",
  miscellaneous: "https://picsum.photos/180/220",
};

// Utility Functions
const cleanImageUrl = (image, category) =>
  image?.trim()?.startsWith("http") ? image : CATEGORY_IMAGES[category?.toLowerCase()] || FALLBACK_IMAGE;

const normalizeCart = (cart) =>
  cart.map((item) => ({
    ...item,
    img: cleanImageUrl(item.img || item.image, item.category),
  }));

// Subcomponents
const CouponSection = ({ couponCode, setCouponCode, applyCoupon, showCouponInput, setShowCouponInput, isLoading }) => (
  <div className="mt-4" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
    <button
      onClick={() => setShowCouponInput(!showCouponInput)}
      className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
      aria-expanded={showCouponInput}
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
          className="w-full max-w-xs border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={applyCoupon}
          disabled={isLoading}
          className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

CouponSection.propTypes = {
  couponCode: PropTypes.string.isRequired,
  setCouponCode: PropTypes.func.isRequired,
  applyCoupon: PropTypes.func.isRequired,
  showCouponInput: PropTypes.bool.isRequired,
  setShowCouponInput: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const CartSummary = ({ cart, removeFromCart, updateQuantity, subtotal, total }) => (
  <div
    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md order-first lg:order-last lg:sticky lg:top-6 w-full lg:w-1/3"
    data-aos="fade-up"
    data-aos-delay="400"
    data-aos-duration="800"
  >
    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Order</h2>
    <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
      <div className="flex justify-between font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
        <span>PRODUCT</span>
        <span>SUBTOTAL</span>
      </div>
      {cart.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your cart is empty.</p>
      ) : (
        cart.map((item, index) => (
          <div
            key={item.id}
            className="flex justify-between gap-2 sm:gap-4 mt-4 text-xs sm:text-sm"
            data-aos="fade-right"
            data-aos-delay={String(index * 100)} // Staggered delay for each item
            data-aos-duration="800"
          >
            <div className="flex items-center space-x-2">
              <img
                src={item.img}
                alt={item.title}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
              />
              <div className="flex flex-col">
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {item.title.length > 20 ? `${item.title.substring(0, 20)}…` : item.title}
                </span>
                <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-1 sm:px-2 py-0.5 sm:py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    aria-label={`Decrease quantity of ${item.title}`}
                  >
                    -
                  </button>
                  <span className="text-gray-800 dark:text-gray-200">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-1 sm:px-2 py-0.5 sm:py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label={`Increase quantity of ${item.title}`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {(item.price * item.quantity).toFixed(2)} EGP
            </span>
          </div>
        ))
      )}
    </div>
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)} EGP</span>
      </div>
      <div className="flex justify-between font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">
        <span>Total</span>
        <span>{total.toFixed(2)} EGP</span>
      </div>
    </div>
  </div>
);

CartSummary.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  subtotal: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

const CheckoutForm = ({ billingDetails, handleInputChange, isLoading }) => {
  const inputClass =
    "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
  const labelClass = "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="space-y-4 sm:space-y-6 flex-1" data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Billing Details</h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={billingDetails.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={billingDetails.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>
              Country / Region <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={billingDetails.country}
              onChange={handleInputChange}
              disabled={isLoading}
              className={inputClass}
              required
            >
              <option value="Egypt">Egypt</option>
              <option value="USA">USA</option>
              <option value="UAE">UAE</option>
            </select>
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>
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
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="townCity" className={labelClass}>
              Town / City <span className="text-red-500">*</span>
            </label>
            <input
              id="townCity"
              type="text"
              name="townCity"
              value={billingDetails.townCity}
              onChange={handleInputChange}
              disabled={isLoading}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="stateCounty" className={labelClass}>
              State / County <span className="text-red-500">*</span>
            </label>
            <select
              id="stateCounty"
              name="stateCounty"
              value={billingDetails.stateCounty}
              onChange={handleInputChange}
              disabled={isLoading}
              className={inputClass}
              required
            >
              <option value="">Select a state</option>
              <option value="Cairo">Cairo</option>
              <option value="Alexandria">Alexandria</option>
              <option value="Giza">Giza</option>
            </select>
          </div>
          <div>
            <label htmlFor="postcode" className={labelClass}>
              Postcode / ZIP <span className="text-red-500">*</span>
            </label>
            <input
              id="postcode"
              type="text"
              name="postcode"
              value={billingDetails.postcode}
              onChange={handleInputChange}
              disabled={isLoading}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={billingDetails.phone}
              onChange={handleInputChange}
              disabled={isLoading}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={billingDetails.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Payment Information</h2>
        <div className="border border-gray-200 dark:border-gray-600 rounded-md p-3 sm:p-4 bg-gray-50 dark:bg-gray-700">
          <p className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Cash on Delivery</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm">Pay with cash upon delivery.</p>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">
          Your personal data will be used to process your order, support your experience on this website, and for other purposes described in our{" "}
          <Link to="/privacy-policy" className="text-blue-500 dark:text-blue-400 hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 sm:mt-6 bg-blue-600 dark:bg-blue-700 text-white py-2 sm:py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center space-x-2 text-sm sm:text-base ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
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
  );
};

CheckoutForm.propTypes = {
  billingDetails: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    country: PropTypes.string,
    address: PropTypes.string,
    townCity: PropTypes.string,
    stateCounty: PropTypes.string,
    postcode: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

// Main Component
const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = normalizeCart(useSelector((state) => state.cart?.items ?? []));

  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    country: "Egypt",
    address: "",
    townCity: "",
    stateCounty: "",
    postcode: "",
    phone: "",
    email: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const { subtotal, total } = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { subtotal, total: subtotal * (1 - discount) };
  }, [cart, discount]);

  const removeFromCart = useCallback(
    (id) => {
      dispatch(setCart(cart.filter((item) => item.id !== id)));
      toast.info("Item removed from cart!", { position: "top-right" });
    },
    [cart, dispatch]
  );

  const updateQuantity = useCallback(
    (id, newQuantity) => {
      if (newQuantity < 1) return;
      dispatch(setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))));
    },
    [cart, dispatch]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const validations = [
      !billingDetails.firstName.trim() && "First name is required.",
      !billingDetails.lastName.trim() && "Last name is required.",
      !billingDetails.address.trim() && "Street address is required.",
      !billingDetails.townCity.trim() && "Town/City is required.",
      !billingDetails.stateCounty.trim() && "State/County is required.",
      !billingDetails.postcode.trim() && "Postcode/ZIP is required.",
      !/^\+?\d{10,15}$/.test(billingDetails.phone) && "Please enter a valid phone.",
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email) && "Please enter a valid email.",
    ].filter(Boolean);

    if (validations.length > 0) {
      validations.forEach((error) => toast.error(error, { position: "top-right" }));
      return false;
    }
    return true;
  }, [billingDetails]);

  const applyCoupon = useCallback(() => {
    const discount = COUPON_CODES[couponCode.trim()] || 0;
    setDiscount(discount);
    toast[discount > 0 ? "success" : "error"](
      discount > 0 ? `Coupon applied! You got ${discount * 100}% off.` : "Invalid coupon code.",
      { position: "top-right" }
    );
  }, [couponCode]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        toast.error("Your cart is empty! Please add items to proceed.", { position: "top-right" });
        return;
      }
      if (!validateForm()) return;
      if (!window.confirm("Are you sure you want to place this order?")) return;

      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const orderNumber = Math.floor(Math.random() * 10000) + 1000;
        navigate("/order-complete", {
          state: {
            orderNumber,
            cart,
            billingDetails,
            total,
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          },
        });
        dispatch(clearCart());
        toast.success("Order placed successfully! Check your email for confirmation.", { position: "top-right" });
      } catch (error) {
        toast.error("An error occurred. Please try again.", { position: "top-right" });
      } finally {
        setIsLoading(false);
      }
    },
    [cart, validateForm, billingDetails, dispatch, navigate, total]
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-4 sm:py-6 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-t-lg"
          data-aos="fade-down"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span>SHOPPING CART</span>
            <span className="font-bold">CHECKOUT</span>
            <span>ORDER COMPLETE</span>
          </div>
        </div>

        <CouponSection
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          applyCoupon={applyCoupon}
          showCouponInput={showCouponInput}
          setShowCouponInput={setShowCouponInput}
          isLoading={isLoading}
        />

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1">
            <CheckoutForm
              billingDetails={billingDetails}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </form>

          <CartSummary
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

Checkout.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string,
      image: PropTypes.string,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      category: PropTypes.string,
    })
  ),
};

export default Checkout;