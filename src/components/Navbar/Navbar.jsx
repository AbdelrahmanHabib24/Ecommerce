import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import Logo from "../../assets/logo.png";
import { IoMdSearch, IoMdMenu, IoMdClose } from "react-icons/io";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { setCartPopup, setWishlistPopup } from "../../Store/Store";

// Menu items
const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Top Rated", link: "/#TopProducts" },
  { id: 3, name: "Woman Wear", link: "/#Products" },
  { id: 4, name: "Mens Wear", link: "/#Products" },
  { id: 5, name: "Electronics", link: "/#Products" },
];

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openWishlistPopup = () => dispatch(setWishlistPopup(true));
  const openCartPopup = () => dispatch(setCartPopup(true));

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white relative z-40">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          {/* Logo and Menu Toggle */}
          <div className="flex justify-between items-center w-full sm:w-auto">
            <a
              href="/"
              className="font-bold text-xl sm:text-3xl flex gap-2"
              data-aos="fade-down"
              data-aos-delay="100"
              data-aos-duration="800"
            >
              <img src={Logo} alt="Shopsy Logo" className="w-8 sm:w-10" />
              Shopsy
            </a>
            <button
              onClick={toggleMenu}
              className="sm:hidden text-gray-500 dark:text-gray-300 p-2"
              data-aos="flip-right"
              data-aos-delay="200"
              data-aos-duration="800"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? (
                <IoMdClose className="w-6 h-6" />
              ) : (
                <IoMdMenu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Search Bar and Icons */}
          <div className="flex justify-between items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <form
              onSubmit={handleSearch}
              className="relative flex-1 sm:flex-none"
              data-aos="fade-down"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px] lg:hover:w-[300px] transition-all rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 right-3"
                aria-label="Submit search"
              >
                <IoMdSearch className="text-gray-500 hover:text-primary w-5 h-5" />
              </button>
            </form>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={openWishlistPopup}
                className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-primary"
                data-aos="fade-down"
                data-aos-delay="400"
                data-aos-duration="800"
                aria-label={`Wishlist (${wishlistItems.length} items)`}
              >
                <FaHeart className="w-5 sm:w-6 h-5 sm:h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={openCartPopup}
                className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-primary"
                data-aos="fade-down"
                data-aos-delay="500"
                data-aos-duration="800"
                aria-label={`Cart (${cartItems.length} items)`}
              >
                <FaShoppingCart className="w-5 sm:w-6 h-5 sm:h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <div
                data-aos="fade-down"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                <DarkMode />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div>
        {/* Mobile Menu */}
        <div
          className={`sm:hidden transition-all duration-300 ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col items-center gap-2 py-2">
            {Menu.map((data, index) => (
              <li
                key={data.id}
                data-aos="fade-right"
                data-aos-delay={String( index * 600)}
                data-aos-duration="800"
              >
                <a
                  href={data.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 hover:text-primary text-sm font-medium"
                >
                  {data.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex justify-center items-center gap-4 py-2">
          {Menu.map((data, index) => (
            <li
              key={data.id}
              data-aos="fade-right

"
              data-aos-delay={String( index * 400)}
              data-aos-duration="800"
            >
              <a
                href={data.link}
                className="px-4 py-2 hover:text-primary text-sm font-medium"
              >
                {data.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
