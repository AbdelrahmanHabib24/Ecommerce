/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { setCartPopup, setWishlistPopup } from "./Store/Store";

// Lazy-loaded components
const Navbar = lazy(() => import("./components/Navbar/Navbar"));
const Hero = lazy(() => import("./components/Hero/Hero"));
const Categories = lazy(() => import("./components/Categories/Categories"));
const Products = lazy(() => import("./components/Products/Products"));
const TopProducts = lazy(() => import("./components/TopProducts/TopProducts"));
const Banner = lazy(() => import("./components/Banner/Banner"));
const Subscribe = lazy(() => import("./components/Subscribe/Subscribe"));
const RecentlyViewed = lazy(() => import("./components/RecentlyViewed/RecentlyViewed"));
const Testimonials = lazy(() => import("./components/Testimonials/Testimonials"));
const Footer = lazy(() => import("./components/Footer/Footer"));
const CartPopup = lazy(() => import("./components/CartPopup/CartPopup"));
const WishlistPopup = lazy(() => import("./components/WishlistPopup/WishlistPopup"));
const ProductDetails = lazy(() => import("./components/ProductDetails/ProductDetails"));
const Checkout = lazy(() => import("./components/Checkout/Checkout"));
const OrderComplete = lazy(() => import("./components/OrderComplete/OrderComplete"));
const SearchPage = lazy(() => import("./components/SearchPage/SearchPage"));
const Shop = lazy(() => import("./components/Shop/Shop"));

const App = () => {
  const dispatch = useDispatch();
  const cartLength = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistLength = useSelector((state) => state.wishlist?.items?.length || 0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen flex flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />
          <FloatingButtons cartLength={cartLength} wishlistLength={wishlistLength} dispatch={dispatch} />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-complete" element={<OrderComplete />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer data-aos="fade-up" data-aos-delay="200" />
          <CartPopup />
          <WishlistPopup />
        </Suspense>
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

const FloatingButtons = ({ cartLength, wishlistLength, dispatch }) => {
  const handleOpenPopup = (type) => {
    dispatch(type === "CART" ? setCartPopup(true) : setWishlistPopup(true));
  };

  return (
    <nav
      className="fixed right-4 top-20 z-50 flex flex-col space-y-4"
      data-aos="fade-left"
      data-aos-delay="300"
    >
      <button
        onClick={() => handleOpenPopup("CART")}
        className="p-3 bg-blue-500 text-white rounded-full relative hover:scale-110 transition-transform"
        aria-label={`Open cart with ${cartLength} items`}
      >
        <FaShoppingCart className="w-6 h-6" />
        {cartLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartLength}
          </span>
        )}
      </button>
      <button
        onClick={() => handleOpenPopup("WISHLIST")}
        className="p-3 bg-purple-500 text-white rounded-full relative hover:scale-110 transition-transform"
        aria-label={`Open wishlist with ${wishlistLength} items`}
      >
        <FaHeart className="w-6 h-6" />
        {wishlistLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlistLength}
          </span>
        )}
      </button>
    </nav>
  );
};



const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div
      className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
      data-aos="fade-in"
    />
  </div>
);

const NotFound = () => (
  <div
    className="flex flex-col items-center justify-center min-h-[200px] text-center"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
    <p className="text-gray-500">The page you're looking for doesn't exist.</p>
  </div>
);

export default App;