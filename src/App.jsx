import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import Categories from "./components/Categories/Categories";

// Lazy-load components
const Products = lazy(() => import("./components/Products/Products"));
const TopProducts = lazy(() => import("./components/TopProducts/TopProducts"));
const Testimonials = lazy(() => import("./components/Testimonials/Testimonials"));
const RecentlyViewed = lazy(() => import("./components/RecentlyViewed/RecentlyViewed"));
const CartPopup = lazy(() => import("./components/CartPopup/CartPopup"));
const WishlistPopup = lazy(() => import("./components/WishlistPopup/WishlistPopup"));
const ProductDetails = lazy(() => import("./components/ProductDetails/ProductDetails"));
const Checkout = lazy(() => import("./components/Checkout/Checkout"));
const OrderComplete = lazy(() => import("./components/OrderComplete/OrderComplete"));
const SearchPage = lazy(() => import("./components/SearchPage/SearchPage"));
const Shop = lazy(() => import("./components/Shop/Shop"));

const App = () => {
  const [cartPopup, setCartPopup] = useState(false);
  const [wishlistPopup, setWishlistPopup] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const savedRecentlyViewed = localStorage.getItem("recentlyViewed");
    return savedRecentlyViewed ? JSON.parse(savedRecentlyViewed) : [];
  });

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // مكون الصفحة الرئيسية (Main Page)
  const MainPage = () => (
    <div className="overflow-hidden">
      <Hero setCartPopup={setCartPopup} />
      <Categories />
      <Suspense fallback={<div className="text-center py-10">Loading Products...</div>}>
        <Products
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          cartPopup={cartPopup}
          setCartPopup={setCartPopup}
          setRecentlyViewed={setRecentlyViewed}
        />
      </Suspense>
      <Suspense fallback={<div className="text-center py-10">Loading Top Products...</div>}>
        <TopProducts
          setCartPopup={setCartPopup}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          setRecentlyViewed={setRecentlyViewed}
        />
      </Suspense>
      <Banner />
      <Subscribe />
      <Suspense fallback={<div className="text-center py-10">Loading Recently Viewed...</div>}>
        <RecentlyViewed
          recentlyViewed={recentlyViewed}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          setCartPopup={setCartPopup}
        />
      </Suspense>
      <Suspense fallback={<div className="text-center py-10">Loading Testimonials...</div>}>
        <Testimonials />
      </Suspense>
    </div>
  );

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative min-h-screen">
        {/* Navbar */}
        <Navbar
          setCartPopup={setCartPopup}
          setWishlistPopup={setWishlistPopup}
          wishlist={wishlist}
          cart={cart}
        />

        {/* زر عائم لفتح Cart */}
        <button
          onClick={() => setCartPopup(true)}
          className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 p-2 sm:p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
          aria-label="Open Cart"
        >
          <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>

        {/* زر عائم لفتح Wishlist */}
        <button
          onClick={() => setWishlistPopup(true)}
          className="fixed top-28 sm:top-36 right-2 sm:right-4 z-50 p-2 sm:p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-200"
          aria-label="Open Wishlist"
        >
          <FaHeart className="w-5 h-5 sm:w-6 sm:h-6" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* الـ Routes */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/shop"
            element={
              <Suspense fallback={<div className="text-center py-10">Loading Shop...</div>}>
                <Shop
                  cart={cart}
                  setCart={setCart}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  setCartPopup={setCartPopup}
                  setRecentlyViewed={setRecentlyViewed}
                />
              </Suspense>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<div className="text-center py-10">Loading Product Details...</div>}>
                <ProductDetails
                  cart={cart}
                  setCart={setCart}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  cartPopup={cartPopup}
                  setCartPopup={setCartPopup}
                  setRecentlyViewed={setRecentlyViewed}
                />
              </Suspense>
            }
          />
          <Route
            path="/checkout"
            element={
              <Suspense fallback={<div className="text-center py-10">Loading Checkout...</div>}>
                <Checkout cart={cart} setCart={setCart} />
              </Suspense>
            }
          />
          <Route
            path="/order-complete"
            element={
              <Suspense fallback={<div className="text-center py-10">Loading Order Complete...</div>}>
                <OrderComplete />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<div className="text-center py-10">Loading Search...</div>}>
                <SearchPage
                  cart={cart}
                  setCart={setCart}
                  wishlist={wishlist}
                  setWishlist={setWishlist}
                  setRecentlyViewed={setRecentlyViewed}
                />
              </Suspense>
            }
          />
        </Routes>

        {/* Footer */}
        <Footer />

        {/* Cart Popup (Sidebar) */}
        <Suspense fallback={null}>
          <CartPopup
            cartPopup={cartPopup}
            setCartPopup={setCartPopup}
            cart={cart}
            setCart={setCart}
            setWishlistPopup={setWishlistPopup}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        </Suspense>

        {/* Wishlist Popup (Sidebar) */}
        <Suspense fallback={null}>
          <WishlistPopup
            wishlistPopup={wishlistPopup}
            setWishlistPopup={setWishlistPopup}
            cart={cart}
            setCart={setCart}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        </Suspense>

        {/* Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="mt-10 sm:mt-0"
        />
      </div>
    </Router>
  );
};

export default App;