/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import FloatingButtons from "./components/FloatingButtons/FloatingButtons";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import NotFound from "./components/NotFound/NotFound";
import CartPopup from "./components/CartPopup/CartPopup";
import WishlistPopup from "./components/WishlistPopup/WishlistPopup";

// Lazy-loaded Pages / Sections 
const Hero = lazy(() => import("./components/Hero/Hero"));
const Categories = lazy(() => import("./components/Categories/Categories"));
const Products = lazy(() => import("./components/Products/Products"));
const TopProducts = lazy(() => import("./components/TopProducts/TopProducts"));
const Banner = lazy(() => import("./components/Banner/Banner"));
const Subscribe = lazy(() => import("./components/Subscribe/Subscribe"));
const RecentlyViewed = lazy(() => import("./components/RecentlyViewed/RecentlyViewed"));
const Testimonials = lazy(() => import("./components/Testimonials/Testimonials"));
const ProductDetails = lazy(() => import("./components/ProductDetails/ProductDetails"));
const Checkout = lazy(() => import("./components/Checkout/Checkout"));
const OrderComplete = lazy(() => import("./components/OrderComplete/OrderComplete"));
const SearchPage = lazy(() => import("./components/SearchPage/SearchPage"));
const Shop = lazy(() => import("./components/Shop/Shop"));

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <FloatingButtons />

        <div className="flex-1 w-full mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-complete" element={<OrderComplete />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>

        <Footer data-aos="fade-up" data-aos-delay="200" />
        <CartPopup />
        <WishlistPopup />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
};

const MainPage = () => (
  <main>
    <Suspense fallback={<LoadingSpinner />}>
      <Hero data-aos="fade-down" data-aos-delay="100" />
      <Categories data-aos="fade-up" data-aos-delay="200" />
      <Products data-aos="fade-up" data-aos-delay="300" />
      <TopProducts data-aos="fade-up" data-aos-delay="400" />
      <Banner data-aos="zoom-in" data-aos-delay="500" />
      <Subscribe data-aos="fade-up" data-aos-delay="600" />
      <RecentlyViewed data-aos="fade-up" data-aos-delay="700" />
      <Testimonials data-aos="fade-up" data-aos-delay="800" />
    </Suspense>
  </main>
);

export default App;
