/* eslint-disable react/prop-types */
// components/Shop/Shop.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";

const Shop = ({ setCart, wishlist, setWishlist, setCartPopup, setRecentlyViewed }) => {
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
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const categoryFilter = new URLSearchParams(location.search).get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.escuelajs.co/api/v1/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const formattedProducts = data.map((product, index) => ({
          id: product.id,
          img: product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150",
          title: product.title,
          price: Number(product.price),
          category: product.category.name,
          description: product.description,
          rating: Math.floor(Math.random() * 5) + 1,
          originalPrice: Number(product.price) * 1.3,
          inStock: Math.random() > 0.3,
          brand: ["Hikvision", "Microsoft", "Team", "Acer"][Math.floor(Math.random() * 4)],
          aosDelay: String(index * 100),
        }));
        setProducts(formattedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (categoryFilter) {
      result = result.filter((product) =>
        product.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (stockFilter.inStock || stockFilter.outOfStock) {
      result = result.filter((product) => {
        if (stockFilter.inStock && stockFilter.outOfStock) return true;
        if (stockFilter.inStock) return product.inStock;
        if (stockFilter.outOfStock) return !product.inStock;
        return true;
      });
    }

    const selectedBrands = Object.keys(brandsFilter).filter(
      (brand) => brandsFilter[brand]
    );
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand.toLowerCase())
      );
    }

    if (sortBy === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, categoryFilter, priceRange, stockFilter, brandsFilter, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleViewDetails = (product) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((item) => item.id !== product.id);
      return [product, ...updated].slice(0, 10); // Keep only the last 10 viewed products
    });
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
    setCartPopup(true);
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
    <div className="py-6 bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Section */}
          <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Filter By Price</h3>
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="74400"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Price: 740 EGP – {priceRange[1]} EGP
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-4">Filter By Stock Status</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockFilter.inStock}
                  onChange={() => setStockFilter({ ...stockFilter, inStock: !stockFilter.inStock })}
                />
                In stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockFilter.outOfStock}
                  onChange={() => setStockFilter({ ...stockFilter, outOfStock: !stockFilter.outOfStock })}
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
                    onChange={() =>
                      setBrandsFilter({ ...brandsFilter, [brand]: !brandsFilter[brand] })
                    }
                  />
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="w-full  lg:w-3/4">
            <div className="flex flex-col  md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
              <h2 className="text-xl font-semibold text-start">
                {categoryFilter ? `Category: ${categoryFilter.replace("-", " ")}` : "All Products"}
              </h2>
              <div className=" flex flex-col md:flex-row md:justify-center md:items-center  gap-4">
                <div className="  justify-between flex items-center gap-2">
                  <span>Show:</span>
                  {[9, 12, 18, 24].map((num) => (
                    <button
                      key={num}
                      onClick={() => setItemsPerPage(num)}
                      className={`px-2 py-0 sm:py-1 rounded-md ${
                        itemsPerPage === num ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border w-full border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 mb-4">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
            </div>

            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-6">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-6">
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

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
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
