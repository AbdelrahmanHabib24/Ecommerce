import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { FaDownload, FaSpinner, FaEnvelope, FaTruck } from "react-icons/fa";
import { toast } from "react-toastify";

// The text to animate
const thankYouText = "Thank you. Your order has been received.";
const characters = thankYouText.split("");

const OrderComplete = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderNumber, cart, billingDetails, total, date } = state || {};
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants for the container (h1)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  // Animation variants for each character
  const characterVariants = {
    hidden: { y: -20, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      },
    },
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to homepage if no state is found
  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);

  // Calculate subtotal
  const subtotal =
    cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  // Function to download the order details as a PDF
  const downloadInvoice = () => {
    const doc = new jsPDF();
    // Add a simple header (e.g., logo or store name)
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("MyStore - Order Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Number: ${orderNumber}`, 20, 35);
    doc.text(`Date: ${date}`, 20, 45);
    doc.text(`Total: ${total.toFixed(2)} EGP`, 20, 55);
    doc.setFontSize(14);
    doc.text("Order Details", 20, 75);
    doc.setFontSize(10);
    let yPosition = 85;
    cart.forEach((item, index) => {
      const productLine = `${index + 1}. ${item.title} x ${item.quantity} - ${(
        item.price * item.quantity
      ).toFixed(2)} EGP`;
      const splitText = doc.splitTextToSize(productLine, 170); // Wrap text if too long
      doc.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 5;
    });
    doc.text(`Subtotal: ${subtotal.toFixed(2)} EGP`, 20, yPosition);
    doc.text(`Total: ${total.toFixed(2)} EGP`, 20, yPosition + 10);
    doc.setFontSize(14);
    doc.text("Billing Address", 20, yPosition + 30);
    doc.setFontSize(10);
    doc.text(
      `${billingDetails.firstName} ${billingDetails.lastName}`,
      20,
      yPosition + 40
    );
    doc.text(billingDetails.address, 20, yPosition + 50);
    if (billingDetails.apartment) {
      doc.text(billingDetails.apartment, 20, yPosition + 60);
      yPosition += 10;
    }
    doc.text(
      `${billingDetails.townCity}, ${billingDetails.stateCounty}`,
      20,
      yPosition + 60
    );
    doc.text(billingDetails.country, 20, yPosition + 70);
    doc.text(billingDetails.postcode, 20, yPosition + 80);
    doc.text(billingDetails.phone, 20, yPosition + 90);
    doc.text(billingDetails.email, 20, yPosition + 100);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Thank you for shopping with MyStore!", 20, yPosition + 120);
    doc.save(`Order_${orderNumber}.pdf`);
  };

  // Simulate sending a confirmation email
  const sendConfirmationEmail = () => {
    // In a real app, this would integrate with an email service like SendGrid
    toast.success("Confirmation email sent to " + billingDetails.email, {
      position: "top-center",
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center"
      >
        <FaSpinner
          className="animate-spin text-blue-500 w-8 h-8"
          aria-label="Loading"
        />
      </motion.div>
    );
  }

  if (!state) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12"
    >
      <div className="container overflow-hidden mx-auto max-w-3xl px-4">
        {/* رسالة الشكر */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold  text-gray-800 dark:text-gray-100 mb-10 text-center relative"
          aria-label="Thank you message"
        >
          <span className="relative inline-block">
            {characters.map((char, index) => (
              <motion.span
                key={index}
                variants={characterVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform scale-x-0 origin-left motion-safe:transition-transform motion-safe:duration-500 motion-safe:delay-1000 group-hover:scale-x-100" />
          </span>
        </motion.h1>

        {/* تفاصيل الطلب */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order number:
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {orderNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date:</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {date}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total:</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {total.toFixed(2)} EGP
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payment method:
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                Cash on delivery
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Order Details
          </h2>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <div className="flex justify-between items-center font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <span>PRODUCT</span>
              <span>TOTAL</span>
            </div>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-3 sm:mt-4 text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 w-full max-w-[70%]">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <span className="text-sm sm:text-base truncate flex-1 min-w-0">
                    {item.title} x {item.quantity}
                  </span>
                </div>
                <span className="text-sm sm:text-base font-medium whitespace-nowrap flex-shrink-0">
                  {(item.price * item.quantity).toFixed(2)} EGP
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* عنوان الفوترة (Billing Address) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Billing Address
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>
              {billingDetails.firstName} {billingDetails.lastName}
            </p>
            {billingDetails.companyName && <p>{billingDetails.companyName}</p>}
            <p>{billingDetails.address}</p>
            {billingDetails.apartment && <p>{billingDetails.apartment}</p>}
            <p>
              {billingDetails.townCity}, {billingDetails.stateCounty}
            </p>
            <p>{billingDetails.country}</p>
            <p>{billingDetails.postcode}</p>
            <p>{billingDetails.phone}</p>
            <p>{billingDetails.email}</p>
          </div>
        </motion.div>

        {/* أزرار الإجراءات */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={downloadInvoice}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Download Invoice"
          >
            <FaDownload />
            Download Invoice
          </button>
          <button
            onClick={sendConfirmationEmail}
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Send Confirmation Email"
          >
            <FaEnvelope />
            Send Email
          </button>
          <Link
            to="#" // Placeholder for a future tracking page
            className="flex items-center justify-center gap-2 bg-purple-500 text-white py-3 px-6 rounded-md hover:bg-purple-600 transition-colors duration-200 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            aria-label="Track Order"
          >
            <FaTruck />
            Track Order
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-3 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Back to Home"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderComplete;
