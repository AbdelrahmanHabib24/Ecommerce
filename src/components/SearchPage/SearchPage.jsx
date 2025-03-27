/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProductCard from '../ProductCard/ProductCard';
import { FaFilter } from 'react-icons/fa';

const SearchPage = ({  setCart, wishlist, setWishlist }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 74400]);
  const [stockFilter, setStockFilter] = useState({ inStock: false, outOfStock: false });
  const [brandsFilter, setBrandsFilter] = useState({
    hikvision: false,
    microsoft: false,
    team: false,
    acer: false,
  });
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for mobile filter toggle

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query') || '';

  // جلب المنتجات من API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();

        const formattedProducts = data.map((product, index) => ({
          id: product.id,
          img: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150',
          title: product.title,
          price: Number(product.price),
          category: product.category.name,
          description: product.description,
          rating: Math.floor(Math.random() * 5) + 1,
          originalPrice: Number(product.price) * 1.3,
          inStock: Math.random() > 0.3,
          brand: ['Hikvision', 'Microsoft', 'Team', 'Acer'][Math.floor(Math.random() * 4)],
          aosDelay: String(index * 100),
        }));
        setProducts(formattedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // تصفية المنتجات بناءً على الفلاتر
  useEffect(() => {
    let result = [...products];

    // تصفية بناءً على كلمة البحث
    if (searchQuery) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // تصفية بناءً على السعر
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // تصفية بناءً على حالة المخزون
    if (stockFilter.inStock || stockFilter.outOfStock) {
      result = result.filter((product) => {
        if (stockFilter.inStock && stockFilter.outOfStock) return true;
        if (stockFilter.inStock) return product.inStock;
        if (stockFilter.outOfStock) return !product.inStock;
        return true;
      });
    }

    // تصفية بناءً على العلامات التجارية
    const selectedBrands = Object.keys(brandsFilter).filter(
      (brand) => brandsFilter[brand]
    );
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand.toLowerCase())
      );
    }

    // الترتيب
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفلاتر
  }, [products, searchQuery, priceRange, stockFilter, brandsFilter, sortBy]);

  // تقسيم المنتجات إلى صفحات
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleViewDetails = (product) => {
    console.log('View details for:', product);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === product.id)) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  return (
    <div className="py-4 sm:py-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container justify-center  px-6 sm:px-6">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md w-full sm:w-auto"
            aria-expanded={isFilterOpen}
            aria-controls="filter-section"
          >
            <FaFilter className="w-5 h-5" />
            <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Section */}
          <div
            id="filter-section"
            className={`w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 ${
              isFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-4">Filter By Price</h3>
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="74400"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full"
                aria-label="Price range filter"
              />
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Price: 740 EGP – {priceRange[1]} EGP
              </p>
              <button
                className="mt-2 px-4 py-1 bg-primary text-white rounded-md hover:bg-blue-600 text-sm w-full sm:w-auto"
                aria-label="Apply price filter"
              >
                Filter
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-4">Filter By Stock Status</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockFilter.inStock}
                  onChange={() => setStockFilter({ ...stockFilter, inStock: !stockFilter.inStock })}
                  aria-label="Filter by in stock"
                />
                <span className="text-sm">In stock</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockFilter.outOfStock}
                  onChange={() => setStockFilter({ ...stockFilter, outOfStock: !stockFilter.outOfStock })}
                  aria-label="Filter by out of stock"
                />
                <span className="text-sm">Out of stock</span>
              </label>
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-4 mt-6">Brands</h3>
            <div className="space-y-2">
              {Object.keys(brandsFilter).map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={brandsFilter[brand]}
                    onChange={() =>
                      setBrandsFilter({ ...brandsFilter, [brand]: !brandsFilter[brand] })
                    }
                    aria-label={`Filter by ${brand}`}
                  />
                  <span className="text-sm">{brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Results Section */}
          <div className="w-full lg:w-3/4">
            <div className="flex sm:px-10 flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Search results: "{searchQuery}"
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className=" text-sm">Show:</span>
                  <div className="flex gap-1">
                    {[9, 12, 18, 24].map((num) => (
                      <button
                        key={num}
                        onClick={() => setItemsPerPage(num)}
                        className={`px-2 py-1 rounded-md text-xs sm:text-sm ${
                          itemsPerPage === num ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-label={`Show ${num} items per page`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm w-full sm:w-auto"
                  aria-label="Sort results"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="text-xs sm:px-10 sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
            </div>

            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-6">No products found.</div>
            ) : (
              <div className="grid px-16 sm:px-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlist={wishlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                      currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SearchPage.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  setWishlist: PropTypes.func.isRequired,
};

export default SearchPage;