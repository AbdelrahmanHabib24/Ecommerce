import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Logo from '../../assets/logo.png';
import { IoMdSearch, IoMdMenu, IoMdClose } from 'react-icons/io';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import DarkMode from './DarkMode';

const Menu = [
  { id: 1, name: 'Home', link: '/' },
  { id: 2, name: 'Top Rated', link: '#TopProducts' },
  { id: 3, name: 'Kids Wear', link: '#Products' },
  { id: 4, name: 'Mens Wear', link: '#Products' },
  { id: 5, name: 'Electronics', link: '#Products' },
];

const Navbar = ({ wishlist = [], cart = [], setCartPopup, setWishlistPopup }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();

  // تهيئة AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      offset: 100,
      delay: 100,
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Reset search query after submission
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="flex justify-between items-center w-full sm:w-auto">
            <a href="/" className="font-bold text-xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Shopsy Logo" className="w-8 sm:w-10" />
              Shopsy
            </a>
            {/* Hamburger Menu Button for Mobile */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-gray-500 dark:text-gray-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <IoMdClose className="w-6 h-6" /> : <IoMdMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Search Bar and Buttons */}
          <div className="flex justify-between items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[200px] lg:group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 text-sm sm:text-base focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                aria-label="Search products"
              />
              <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-3">
                <IoMdSearch className="text-gray-500 group-hover:text-primary w-5 h-5" />
              </button>
            </form>

            {/* Wishlist and Cart Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setWishlistPopup(true)}
                className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                aria-label={`Open wishlist with ${wishlist.length} items`}
              >
                <FaHeart className="w-5 sm:w-6 h-5 sm:h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCartPopup(true)}
                className="relative p-2 text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                aria-label={`Open cart with ${cart.length} items`}
              >
                <FaShoppingCart className="w-5 sm:w-6 h-5 sm:h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Dark Mode Switch */}
              <DarkMode />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div data-aos="zoom-in">
        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`sm:hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <ul className="flex flex-col items-center gap-2 py-2">
            {Menu.map((data) => (
              <li key={data.id}>
                <a
                  href={data.link}
                  onClick={() => setIsMenuOpen(false)} // Close menu on link click
                  className="inline-block px-4 py-2 hover:text-primary duration-200 text-sm font-medium"
                >
                  {data.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex justify-center items-center gap-4 py-2">
          {Menu.map((data) => (
            <li key={data.id}>
              <a
                href={data.link}
                className="inline-block px-4 py-2 hover:text-primary duration-200 text-sm font-medium"
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

Navbar.propTypes = {
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ),
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  setCartPopup: PropTypes.func.isRequired,
  setWishlistPopup: PropTypes.func.isRequired,
};

export default Navbar;