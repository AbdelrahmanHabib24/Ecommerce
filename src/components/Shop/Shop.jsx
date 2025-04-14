import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { addToCart } from "../../reducers/cartReducer";
import { addToWishlist, removeFromWishlist } from "../../reducers/wishlistReducer";

const FALLBACK_IMAGE = "https://picsum.photos/180/220";
const categoryImages = {
  electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=180&h=220&fit=crop",
  jewelery: "https://images.unsplash.com/photo-1606760227091-3dd44d7d1e44?q=80&w=180&h=220&fit=crop",
  clothes: "https://images.unsplash.com/photo-1593032465175-4e37b22e72d7?q=80&w=180&h=220&fit=crop",
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockFilter, setStockFilter] = useState({ inStock: false, outOfStock: false });
  const [brandsFilter, setBrandsFilter] = useState({ hikvision: false, microsoft: false, team: false, acer: false });
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category") || "";
  const mappedCategoryFilter =
    categoryFilter.replace(/-/g, " ") === "men's clothing" || categoryFilter.replace(/-/g, " ") === "women's clothing"
      ? "Clothes"
      : categoryFilter.replace(/-/g, " ");

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const cart = useSelector((state) => state.cart.items || []);
  const recentlyViewed = useSelector((state) => state.recentlyViewed || []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const formattedProducts = data.map((product, index) => {
          let category = product.category.toLowerCase();
          if (category === "men's clothing" || category === "women's clothing") category = "Clothes";
          return {
            id: product.id,
            img: product.image?.startsWith("http") ? product.image : categoryImages[category] || FALLBACK_IMAGE,
            title: product.title || "Unnamed Product",
            price: Number(product.price) || 0,
            category,
            description: product.description || "No description available",
            rating: product.rating?.rate ? Math.round(product.rating.rate) : 4,
            originalPrice: Number(product.price) * 1.3,
            inStock: Math.random() > 0.3,
            brand: ["Hikvision", "Microsoft", "Team", "Acer"][index % 4],
            aosDelay: String(index * 100),
          };
        });
        setProducts(formattedProducts);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (mappedCategoryFilter) {
      result = result.filter(
        (product) => product.category.toLowerCase() === mappedCategoryFilter.toLowerCase()
      );
    }

    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    if (stockFilter.inStock || stockFilter.outOfStock) {
      result = result.filter((product) =>
        stockFilter.inStock && stockFilter.outOfStock ? true : stockFilter.inStock ? product.inStock : !product.inStock
      );
    }

    const selectedBrands = Object.keys(brandsFilter).filter((brand) => brandsFilter[brand]);
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand.toLowerCase()));
    }

    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, mappedCategoryFilter, priceRange, stockFilter, brandsFilter, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewDetails = (product) => {
    dispatch({
      type: "SET_RECENTLY_VIEWED",
      payload: [product, ...recentlyViewed.filter((item) => item.id !== product.id)].slice(0, 10),
    });
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    dispatch(addToCart({ ...product, quantity: existingItem ? existingItem.quantity + 1 : 1 }));
    toast.success(existingItem ? "Cart updated!" : "Added to cart!");
  };

  const handleToggleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.info("Removed from wishlist!");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist!");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [mappedCategoryFilter, priceRange, stockFilter, brandsFilter, sortBy, itemsPerPage]);

  return (
    <div className="py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Filter By Price</h3>
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full accent-blue-500 mb-2"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-blue-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Price: ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-4">Filter By Stock Status</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockFilter.inStock}
                  onChange={() => setStockFilter({ ...stockFilter, inStock: !stockFilter.inStock })}
                  className="accent-blue-500"
                />
                In stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockFilter.outOfStock}
                  onChange={() => setStockFilter({ ...stockFilter, outOfStock: !stockFilter.outOfStock })}
                  className="accent-blue-500"
                />
                Out of stock
              </label>
            </div>

            <h3 className="text-lg font-semibold mb-4 mt-6">Brands</h3>
            <div className="space-y-2">
              {Object.keys(brandsFilter).map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={brandsFilter[brand]}
                    onChange={() => setBrandsFilter({ ...brandsFilter, [brand]: !brandsFilter[brand] })}
                    className="accent-blue-500"
                  />
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold">
                {mappedCategoryFilter ? `Category: ${mappedCategoryFilter}` : "All Products"}
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Show:</span>
                  {[9, 12, 18, 24].map((num) => (
                    <button
                      key={num}
                      onClick={() => setItemsPerPage(num)}
                      className={`px-2 py-1 rounded-md text-sm ${
                        itemsPerPage === num ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-2 py-1 bg-white dark:bg-gray-800 w-full md:w-auto"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>

            {loading ? (
              <div className="text-center py-6">
                <FaSpinner className="animate-spin text-blue-500 w-8 h-8 mx-auto" />
                <p className="mt-2">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <p className="text-red-500 dark:text-red-400">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-lg font-semibold">No Products Available</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  No products match your current filters.
                </p>
                <button
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    setStockFilter({ inStock: false, outOfStock: false });
                    setBrandsFilter({ hikvision: false, microsoft: false, team: false, acer: false });
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
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
              />
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                    }`}
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

export default Shop;