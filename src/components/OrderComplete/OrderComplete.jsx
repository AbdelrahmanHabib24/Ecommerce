/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { FaDownload, FaSpinner, FaEnvelope, FaTruck } from "react-icons/fa";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import "aos/dist/aos.css";



const ThankYouMessage = () => (
  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8 lg:mb-10 text-center typing-effect"
      data-aos="fade-down" data-aos-delay="50" data-aos-duration="800" data-aos-once="true">
    Thank you. Your order has been received.
  </h1>
);

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{value}</p>
  </div>
);

const OrderSummary = ({ orderNumber, date, total }) => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8"
       data-aos="fade-up" data-aos-delay="150" data-aos-duration="800" data-aos-once="true">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
      <SummaryItem label="Order number:" value={orderNumber} />
      <SummaryItem label="Date:" value={date} />
      <SummaryItem label="Total:" value={`${total.toFixed(2)} EGP`} />
      <SummaryItem label="Payment method:" value="Cash on delivery" />
    </div>
  </div>
);

const OrderItems = ({ cart, subtotal, total }) => (
  <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8"
       data-aos="fade-up" data-aos-delay="250" data-aos-duration="800" data-aos-once="true">
    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
      Order Details
    </h2>
    <div className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 mb-3 sm:mb-4">
      <div className="flex justify-between font-semibold text-xs sm:text-base text-gray-700 dark:text-gray-300">
        <span>PRODUCT</span>
        <span>TOTAL</span>
      </div>
      {cart.map((item, i) => (
        <div key={item.id} className="flex items-center justify-between mt-2 sm:mt-4 text-gray-600 dark:text-gray-400"
             data-aos="fade-up" data-aos-delay={String(300 + i * 100)} data-aos-duration="800" data-aos-once="true">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full max-w-[60%] sm:max-w-[70%]">
            {item.img && <img src={item.img} alt={item.title} className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-md" />}
            <span className="text-xs sm:text-sm lg:text-base truncate">{item.title} x {item.quantity}</span>
          </div>
          <span className="text-xs sm:text-sm lg:text-base font-medium">{(item.price * item.quantity).toFixed(2)} EGP</span>
        </div>
      ))}
    </div>
    <div className="flex justify-between font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100">
      <span>Subtotal:</span>
      <span>{subtotal.toFixed(2)} EGP</span>
    </div>
    <div className="flex justify-between font-bold text-base sm:text-lg mt-1 sm:mt-2 text-gray-800 dark:text-gray-100">
      <span>Total:</span>
      <span>{total.toFixed(2)} EGP</span>
    </div>
  </div>
);

const BillingAddress = ({ billingDetails }) => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8"
       data-aos="fade-up" data-aos-delay="350" data-aos-duration="800" data-aos-once="true">
    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
      Billing Address
    </h2>
    <div className="space-y-1 sm:space-y-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm lg:text-base">
      <p>{billingDetails.firstName} {billingDetails.lastName}</p>
      {billingDetails.companyName && <p>{billingDetails.companyName}</p>}
      <p>{billingDetails.address}</p>
      {billingDetails.apartment && <p>{billingDetails.apartment}</p>}
      <p>{billingDetails.townCity}, {billingDetails.stateCounty}</p>
      <p>{billingDetails.country}</p>
      <p>{billingDetails.postcode}</p>
      <p>{billingDetails.phone}</p>
      <p>{billingDetails.email}</p>
    </div>
  </div>
);

const ActionButton = ({ children, onClick, color }) => (
  <button onClick={onClick}
          className={`flex items-center justify-center gap-2 bg-${color}-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-${color}-600 text-sm sm:text-base`}
          data-aos="zoom-in" data-aos-duration="800">
    {children}
  </button>
);

const ActionButtons = ({ downloadInvoice, sendConfirmationEmail }) => (
  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4" data-aos="fade-up" data-aos-delay="450" data-aos-duration="800" data-aos-once="true">
    <ActionButton onClick={downloadInvoice} color="blue"><FaDownload /> Download Invoice</ActionButton>
    <ActionButton onClick={sendConfirmationEmail} color="green"><FaEnvelope /> Send Email</ActionButton>
    <Link to="/" className="flex items-center justify-center gap-2 bg-purple-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-purple-600 text-sm sm:text-base" data-aos="zoom-in" data-aos-delay="700"><FaTruck /> Track Order</Link>
    <Link to="/" className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base" data-aos="zoom-in" data-aos-delay="800">Back to Home</Link>
  </div>
);

// Main component
const OrderComplete = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);


  const { orderNumber, cart, billingDetails, total, date } = state || {};
  const subtotal = cart.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 1000); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!orderNumber || !cart.length || !billingDetails || !total || !date) {
      toast.error("Order details are incomplete. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [orderNumber, cart, billingDetails, total, date, navigate]);

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20).text("MyStore - Order Confirmation", 20, 20);
    doc.setFontSize(12)
      .text(`Order Number: ${orderNumber}`, 20, 35)
      .text(`Date: ${date}`, 20, 45)
      .text(`Total: ${total.toFixed(2)} EGP`, 20, 55);
    let y = 75;
    doc.setFontSize(14).text("Order Details", 20, y); y+=10;
    doc.setFontSize(10);
    cart.forEach((item,i)=>{ const line = `${i+1}. ${item.title} x ${item.quantity} - ${(item.price*item.quantity).toFixed(2)} EGP`; const split = doc.splitTextToSize(line,170); doc.text(split,20,y); y+= split.length*5 +5; });
    doc.text(`Subtotal: ${subtotal.toFixed(2)} EGP`,20,y);
    doc.text(`Total: ${total.toFixed(2)} EGP`,20,y+10);
    y+=30;
    doc.setFontSize(14).text("Billing Address",20,y); y+=10;
    doc.setFontSize(10)
      .text(`${billingDetails.firstName} ${billingDetails.lastName}`,20,y)
      .text(billingDetails.address,20,y+10)
      .text(`${billingDetails.townCity}, ${billingDetails.stateCounty}`,20,y+20)
      .text(billingDetails.country,20,y+30)
      .text(billingDetails.postcode,20,y+40)
      .text(billingDetails.phone,20,y+50)
      .text(billingDetails.email,20,y+60);
    doc.save(`Order_${orderNumber}.pdf`);
    toast.success("Invoice downloaded successfully!");
  };

  const sendConfirmationEmail = () => {
    emailjs.send(
      "service_wvvvxjr", 
      "template_x58c76z", 
      {
        to_name: billingDetails.firstName,
        to_email: billingDetails.email,
        order_number: orderNumber,
        total_amount: total.toFixed(2),
        order_date: date,
      },
      "oIWQkqLqpM_aZk5Zx" 
    )
    .then(()=> toast.success("Confirmation email sent!"))
    .catch((err)=> toast.error("Failed to send email: "+err.text));
  };

  if (isLoading) return <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-blue-500 w-6 h-6 sm:w-8 sm:h-8"/></div>;
  if (!orderNumber || !cart.length || !billingDetails || !total || !date) return <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center"><p className="text-gray-800 dark:text-gray-100 text-base sm:text-lg">No order details found. Redirecting...</p></div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 sm:py-12">
      <div className="container mx-auto max-w-3xl px-2 sm:px-4">
        <ThankYouMessage />
        <OrderSummary orderNumber={orderNumber} date={date} total={total} />
        <OrderItems cart={cart} subtotal={subtotal} total={total} />
        <BillingAddress billingDetails={billingDetails} />
        <ActionButtons downloadInvoice={downloadInvoice} sendConfirmationEmail={sendConfirmationEmail} />
      </div>
    </div>
  );
};

export default OrderComplete;
