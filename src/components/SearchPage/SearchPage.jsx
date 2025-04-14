/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductCard from "../ProductCard/ProductCard";
import { FaFilter, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";
import { addToWishlist, removeFromWishlist } from "../../reducers/wishlistReducer";

const EXCHANGE_RATE = 48;

const cleanImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";
  const trimmed = image.trim();
  return trimmed.startsWith("http") ? trimmed : "";
};

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 0]); // سيتم تحديثه ديناميكيًا
  const [maxPrice, setMaxPrice] = useState(0);
  const [stockFilter, setStockFilter] = useState({ inStock: false, outOfStock: false });
  const [brandsFilter, setBrandsFilter] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist?.items || []);
  const cart = useSelector((state) => state.cart?.items || []);
  const recentlyViewed = useSelector((state) => state.recentlyViewed || []);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  // جلب البيانات
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const formattedProducts = data.map((product, index) => {
          let category = product.category || "Miscellaneous";
          if (category.includes("clothing")) category = "Clothes";
          const price = Number(product.price) || 0;
          return {
            id: product.id,
            img: cleanImageUrl(product.image),
            title: product.title || "Unnamed Product",
            price,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            description: product.description || "No description available",
            rating: product.rating?.rate ? Math.round(product.rating.rate) : 4,
            originalPrice: price * 1.3,
            inStock: price > 10, // محاكاة inStock بناءً على السعر
            brand: ["Hikvision", "Microsoft", "Generic", "Acer"][index % 4],
            aosDelay: String(index * 100),
          };
        });

        const maxPriceEGP = Math.ceil(
          Math.max(...formattedProducts.map((p) => p.price * EXCHANGE_RATE))
        );
        setMaxPrice(maxPriceEGP);
        setPriceRange([0, maxPriceEGP]);
        setProducts(formattedProducts);
        setBrandsFilter(
          Object.fromEntries(
            [...new Set(formattedProducts.map((p) => p.brand.toLowerCase()))].map(
              (brand) => [brand, false]
            )
          )
        );
        console.log("Fetched products:", formattedProducts);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load products.");
        setProducts([]);
        setBrandsFilter({});
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  // Refresh AOS when filter panel toggles
  useEffect(() => {
    AOS.refresh();
  }, [isFilterOpen]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products.length) {
      console.log("No products available for filtering");
      return [];
    }

    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const title = p.title?.toLowerCase() || "";
        const description = p.description?.toLowerCase() || "";
        const category = p.category?.toLowerCase() || "";
        const matches =
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query);
        console.log(`Product ${p.title}: matches=${matches}`);
        return matches;
      });
    }

    result = result.filter((p) => {
      const priceEGP = p.price * EXCHANGE_RATE;
      return priceEGP >= priceRange[0] && priceEGP <= priceRange[1];
    });

    if (stockFilter.inStock || stockFilter.outOfStock) {
      result = result.filter((p) =>
        stockFilter.inStock && stockFilter.outOfStock
          ? true
          : stockFilter.inStock
          ? p.inStock
          : !p.inStock
      );
    }

    const selectedBrands = Object.keys(brandsFilter).filter(
      (brand) => brandsFilter[brand]
    );
    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.includes(p.brand.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - b.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    console.log("Filtered Products:", result);
    return result;
  }, [products, searchQuery, priceRange, stockFilter, brandsFilter, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const handleViewDetails = useCallback(
    (product) => {
      dispatch({
        type: "recentlyViewed/add",
        payload: [
          product,
          ...recentlyViewed.filter((item) => item.id !== product.id),
        ].slice(0, 10),
      });
    },
    [dispatch, recentlyViewed]
  );

  const handleAddToCart = useCallback(
    (product, e) => {
      e.preventDefault();
      const existing = cart.find((item) => item.id === product.id);
      dispatch(
        existing
          ? updateCartQuantity({ id: product.id, quantity: existing.quantity + 1 })
          : addToCart({ ...product, quantity: 1 })
      );
      toast.success(existing ? "Cart updated!" : "Added to cart!");
      setShowCartPopup(true);
    },
    [dispatch, cart]
  );

  const handleToggleWishlist = useCallback(
    (product, e) => {
      e.preventDefault();
      const isInWishlist = wishlist.some((item) => item.id === product.id);
      const newProduct = { ...product, img: cleanImageUrl(product.img) };
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
        toast.info("Removed from wishlist!");
      } else {
        dispatch(addToWishlist(newProduct));
        toast.success("Added to wishlist!");
      }
    },
    [dispatch, wishlist]
  );

  const handleToggleShowAll = useCallback(() => {
    setShowAllProducts((prev) => !prev);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setPriceRange([0, maxPrice]);
    setStockFilter({ inStock: false, outOfStock: false });
    setBrandsFilter((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, false]))
    );
    setSearchParams({});
    setCurrentPage(1);
    console.log("Filters reset");
  }, [maxPrice, setSearchParams]);

  // Reset currentPage when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, stockFilter, brandsFilter, sortBy, itemsPerPage]);

  return (
    <div className="py-6 sm:py-8 bg-white dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Filter Toggle for Mobile */}
        <div
          className="lg:hidden mb-4 sm:mb-6"
          data-aos="fade-down"
          data-aos-delay="50"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md w-full sm:w-auto text-sm sm:text-base"
          >
            <FaFilter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filter Panel */}
          <div
            className={`w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
              isFilterOpen
                ? "block opacity-100 translate-y-0"
                : "hidden opacity-0 -translate-y-4 lg:block lg:opacity-100 lg:translate-y-0"
            }`}
            data-aos="fade-right"
            data-aos-delay="150"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <div className="flex justify-end lg:hidden">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-blue-500 text-sm hover:underline"
              >
                Close
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
              Filter By Price
            </h3>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-full accent-blue-500 mb-2"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-blue-500"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Price: {priceRange[0].toLocaleString()} EGP –{" "}
                {priceRange[1].toLocaleString()} EGP
              </p>
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 mt-4 sm:mt-6 text-gray-800 dark:text-gray-100">
              Filter By Stock Status
            </h3>
            <div className="space-y-2">
              <label
                className="flex items-center gap-2"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="800"
                data-aos-once="true"
              >
                <input
                  type="checkbox"
                  checked={stockFilter.inStock}
                  onChange={() =>
                    setStockFilter({ ...stockFilter, inStock: !stockFilter.inStock })
                  }
                  className="accent-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="text-xs sm:text-sm">In stock</span>
              </label>
              <label
                className="flex items-center gap-2"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="800"
                data-aos-once="true"
              >
                <input
                  type="checkbox"
                  checked={stockFilter.outOfStock}
                  onChange={() =>
                    setStockFilter({
                      ...stockFilter,
                      outOfStock: !stockFilter.outOfStock,
                    })
                  }
                  className="accent-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="text-xs sm:text-sm">Out of stock</span>
              </label>
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 mt-4 sm:mt-6 text-gray-800 dark:text-gray-100">
              Brands
            </h3>
            <div className="space-y-2">
              {Object.keys(brandsFilter).map((brand, index) => (
                <label
                  key={brand}
                  className="flex items-center gap-2"
                  data-aos="fade-up"
                  data-aos-delay={String(200 + index * 100)}
                  data-aos-duration="800"
                  data-aos-once="true"
                >
                  <input
                    type="checkbox"
                    checked={brandsFilter[brand]}
                    onChange={() =>
                      setBrandsFilter({
                        ...brandsFilter,
                        [brand]: !brandsFilter[brand],
                      })
                    }
                    className="accent-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="text-xs sm:text-sm">
                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div className="w-full lg:w-3/4">
            <div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4"
              data-aos="fade-down"
              data-aos-delay="100"
              data-aos-duration="800"
              data-aos-once="true"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                Search results: "{searchQuery || "All Products"}"
              </h2>
              {searchQuery && (
                <button
                  onClick={() => setSearchParams({})}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base"
                >
                  Clear Search
                </button>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm">Show:</span>
                  <div className="flex gap-1">
                    {[9, 12, 18, 24].map((num, index) => (
                      <button
                        key={num}
                        onClick={() => {
                          setItemsPerPage(num);
                          setCurrentPage(1);
                        }}
                        className={`px-2 py-1 rounded-md text-xs sm:text-sm ${
                          itemsPerPage === num
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                        data-aos="zoom-in"
                        data-aos-delay={String(150 + index * 50)}
                        data-aos-duration="800"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-xs sm:text-sm w-full sm:w-auto"
                  data-aos="fade-down"
                  data-aos-delay="300"
                  data-aos-duration="800"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div
              className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
              data-aos-once="true"
            >
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>

            {loading ? (
              <div
                className="text-center py-6"
                data-aos="fade-in"
                data-aos-delay="50"
                data-aos-duration="800"
                data-aos-once="true"
              >
                <FaSpinner className="animate-spin text-blue-500 w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                <p className="mt-2 text-sm sm:text-base">Loading products...</p>
              </div>
            ) : error ? (
              <div
                className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg"
                data-aos="fade-in"
                data-aos-delay="50"
                data-aos-duration="800"
                data-aos-once="true"
              >
                <p className="text-red-500 dark:text-red-400 text-base sm:text-lg">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg"
                data-aos="fade-up"
                data-aos-delay="150"
                data-aos-duration="800"
                data-aos-once="true"
              >
                <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  No Results Found
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  No products match your search query "{searchQuery}" or filters.
                </p>
                {searchQuery && (
                  <div className="mt-4">
                    <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm sm:text-base">
                      Did you mean:
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {["Shirt", "Clothes", "Electronics", "Jewelery"].map(
                        (suggestion, index) => (
                          <button
                            key={suggestion}
                            onClick={() =>
                              setSearchParams({ query: suggestion })
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs sm:text-sm"
                            data-aos="zoom-in"
                            data-aos-delay={String(200 + index * 100)}
                            data-aos-duration="800"
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
                <button
                  onClick={resetFilters}
                  className="mt-4 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md text-sm sm:text-base"
                  data-aos="fade-up"
                  data-aos-delay="350"
                  data-aos-duration="800"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <ProductCard
                products={paginatedProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onViewDetails={handleViewDetails}
                wishlist={wishlist}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onToggleShowAll={handleToggleShowAll}
                showAllProducts={showAllProducts}
              />
            )}
          </div>
        </div>
      </div>
      {showCartPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <p>Item added to cart!</p>
          <button
            onClick={() => setShowCartPopup(false)}
            className="mt-2 px-3 py-1 bg-white text-green-500 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;