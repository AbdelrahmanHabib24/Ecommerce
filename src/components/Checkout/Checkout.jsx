/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSpinner, FaTrash } from "react-icons/fa";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
  selectCartItems,
} from "../../reducers/cartReducer";

const COUPON_CODES = { DISCOUNT10: 0.1 };

const CouponSection = ({
  code,
  setCode,
  onApply,
  visible,
  toggle,
  loading,
}) => (
  <div
    className="mt-4"
    data-aos="fade-up"
    data-aos-delay="200"
    data-aos-duration="800"
  >
    <button
      onClick={toggle}
      className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
      aria-expanded={visible}
    >
      Have a coupon? Click here to enter your code
    </button>

    {visible && (
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          disabled={loading}
          className="w-full max-w-xs border rounded-md p-2 text-sm
            border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={onApply}
          disabled={loading}
          className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md 
            hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

// ===== Cart Summary =====
const CartSummary = ({ cart, onRemove, onUpdate, subtotal, total }) => (
  <div
    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md order-first lg:order-last lg:sticky lg:top-6 w-full lg:w-1/3"
    data-aos="fade-up"
    data-aos-delay="400"
    data-aos-duration="800"
  >
    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      Your Order
    </h2>

    <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
      <div className="flex justify-between font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
        <span>PRODUCT</span>
        <span>SUBTOTAL</span>
      </div>

      {cart.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Your cart is empty.
        </p>
      ) : (
        cart.map((item, i) => (
          <div
            key={item.id}
            className="flex justify-between gap-4 mt-4 text-xs sm:text-sm"
            data-aos="fade-right"
            data-aos-delay={String(i * 100)}
            data-aos-duration="800"
          >
            <div className="flex items-center gap-2">
              <img
                src={item.img}
                alt={item.title}
                className="w-10 h-10 sm:w-12 sm:h-12 object-fill rounded-md"
              />
              <div>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {item.title.length > 20
                    ? `${item.title.slice(0, 20)}…`
                    : item.title}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => onUpdate(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="border rounded-md px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-gray-800 dark:text-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdate(item.id, item.quantity + 1)}
                    className="border rounded-md px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <FaTrash className="w-4 h-4" />
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

    <div className="space-y-3">
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

// ===== Checkout Form =====
const CheckoutForm = ({ details, onChange, loading }) => {
  const inputClass =
    "mt-1 block w-full border rounded-md p-2 text-sm disabled:opacity-50 " +
    "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div
      className="space-y-6 flex-1"
      data-aos="fade-up"
      data-aos-delay="600"
      data-aos-duration="800"
    >
      {/* Billing Details */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Billing Details
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: "firstName", label: "First name", required: true },
            { id: "lastName", label: "Last name", required: true },
            {
              id: "country",
              label: "Country / Region",
              type: "select",
              options: ["Egypt", "USA", "UAE"],
              required: true,
            },
            {
              id: "address",
              label: "Street address",
              placeholder: "House number and street name",
              required: true,
            },
            { id: "townCity", label: "Town / City", required: true },
            {
              id: "stateCounty",
              label: "State / County",
              type: "select",
              options: ["Cairo", "Alexandria", "Giza"],
              required: true,
            },
            { id: "postcode", label: "Postcode / ZIP", required: true },
            { id: "phone", label: "Phone", type: "tel", required: true },
            {
              id: "email",
              label: "Email address",
              type: "email",
              required: true,
            },
          ].map(
            ({ id, label, type = "text", required, placeholder, options }) => (
              <div key={id}>
                <label htmlFor={id} className={labelClass}>
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === "select" ? (
                  <select
                    id={id}
                    name={id}
                    value={details[id]}
                    onChange={onChange}
                    disabled={loading}
                    className={inputClass}
                    required={required}
                  >
                    <option value="">{`Select ${label}`}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    type={type}
                    name={id}
                    value={details[id]}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={loading}
                    className={inputClass}
                    required={required}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Payment Information
        </h2>
        <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-700">
          <p className="font-medium">Cash on Delivery</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Pay with cash upon delivery.
          </p>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
          Your personal data will be used to process your order and for other
          purposes described in our{" "}
          <Link to="/privacy-policy" className="text-blue-500 hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center gap-2 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin h-5 w-5" />
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

// ===== Main Component =====
const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);

  const [details, setDetails] = useState({
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
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const { subtotal, total } = useMemo(() => {
    const sub = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { subtotal: sub, total: sub * (1 - discount) };
  }, [cart, discount]);

  const onRemove = useCallback(
    (id) => {
      dispatch(removeFromCart(id));
      toast.info("Item removed from cart!");
    },
    [cart]
  );

  const onUpdate = useCallback(
    (id, qty) => {
      if (qty < 1) return;
      dispatch(updateCartQuantity({ id, quantity: qty }));
    },
    [cart]
  );

  const onChange = (e) =>
    setDetails((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const errors = [
      !details.firstName && "First name is required",
      !details.lastName && "Last name is required",
      !details.address && "Street address is required",
      !details.townCity && "Town/City is required",
      !details.stateCounty && "State/County is required",
      !details.postcode && "Postcode is required",
      !/^\+?\d{10,15}$/.test(details.phone) && "Invalid phone",
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email) && "Invalid email",
    ].filter(Boolean);

    if (errors.length) {
      errors.forEach((err) => toast.error(err));
      return false;
    }
    return true;
  };

  const onApplyCoupon = () => {
    const disc = COUPON_CODES[coupon.trim()] || 0;
    setDiscount(disc);
    toast[disc ? "success" : "error"](
      disc ? `Coupon applied! ${disc * 100}% off` : "Invalid coupon code"
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return toast.error("Your cart is empty!");
    if (!validate() || !window.confirm("Confirm your order?")) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      navigate("/order-complete", {
        state: {
          orderNumber: Math.floor(Math.random() * 9000) + 1000,
          cart,
          billingDetails: details,
          total,
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        },
      });
      dispatch(clearCart());
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-6 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div
          className="bg-blue-600 text-white py-3 px-6 rounded-t-lg"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <div className="flex justify-between text-sm">
            <span>SHOPPING CART</span>
            <span className="font-bold">CHECKOUT</span>
            <span>ORDER COMPLETE</span>
          </div>
        </div>

        <CouponSection
          code={coupon}
          setCode={setCoupon}
          onApply={onApplyCoupon}
          visible={showCoupon}
          toggle={() => setShowCoupon(!showCoupon)}
          loading={loading}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <form onSubmit={onSubmit} className="flex-1 space-y-6">
            <CheckoutForm
              details={details}
              onChange={onChange}
              loading={loading}
            />
          </form>
          <CartSummary
            cart={cart}
            onRemove={onRemove}
            onUpdate={onUpdate}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
