import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import CartPopup from "./components/CartPopup/CartPopup";
import WishlistPopup from "./components/WishlistPopup/WishlistPopup";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Checkout from "./components/Checkout/Checkout";
import OrderComplete from "./components/OrderComplete/OrderComplete";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import SearchPage from "./components/SearchPage/SearchPage";

// مكونات جديدة
import Categories from "./components/Categories/Categories";
import RecentlyViewed from "./components/RecentlyViewed/RecentlyViewed";
import Shop from "./components/Shop/Shop";

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
     
      <Products
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        setWishlist={setWishlist}
        cartPopup={cartPopup}
        setCartPopup={setCartPopup}
        setRecentlyViewed={setRecentlyViewed}
      />
      <TopProducts
        setCartPopup={setCartPopup}
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        setWishlist={setWishlist}
        setRecentlyViewed={setRecentlyViewed}
      />
      <Banner />
      <Subscribe />
      <RecentlyViewed
        recentlyViewed={recentlyViewed}
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        setWishlist={setWishlist}
        setCartPopup={setCartPopup}
      />
      <Testimonials />
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
              <Shop
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                setCartPopup={setCartPopup}
                setRecentlyViewed={setRecentlyViewed}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                cartPopup={cartPopup}
                setCartPopup={setCartPopup}
                setRecentlyViewed={setRecentlyViewed}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} setCart={setCart} />}
          />
          <Route path="/order-complete" element={<OrderComplete />} />
          <Route
            path="/search"
            element={
              <SearchPage
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                setRecentlyViewed={setRecentlyViewed}
              />
            }
          />
        </Routes>

        {/* Footer */}
        <Footer />

        {/* Cart Popup (Sidebar) */}
        <CartPopup
          cartPopup={cartPopup}
          setCartPopup={setCartPopup}
          cart={cart}
          setCart={setCart}
          setWishlistPopup={setWishlistPopup}
          wishlist={wishlist}
          setWishlist={setWishlist}
        />

        {/* Wishlist Popup (Sidebar) */}
        <WishlistPopup
          wishlistPopup={wishlistPopup}
          setWishlistPopup={setWishlistPopup}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
        />

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