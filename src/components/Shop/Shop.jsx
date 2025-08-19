import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { addToCart } from "../../reducers/cartReducer";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../reducers/wishlistReducer";
import {
  fetchProducts,
  setError,
  selectAllProducts,
  selectLoading,
  selectError,
} from "../../reducers/productsReducer";
import ProductDetailsModal from "../ProductDetailsModal/ProductDetailsModal";

const defaultBrands = ["hikvision", "microsoft", "team", "acer"];

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const allProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const cart = useSelector((state) => state.cart.items || []);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockFilter, setStockFilter] = useState({
    inStock: false,
    outOfStock: false,
  });
  const [brandsFilter, setBrandsFilter] = useState(
    defaultBrands.reduce((acc, brand) => ({ ...acc, [brand]: false }), {})
  );
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryParam = queryParams.get("category")?.toLowerCase() || "";

  // Fetch products
  useEffect(() => {
    if (!allProducts?.length && !loading && !error) {
      dispatch(fetchProducts())
        .unwrap()
        .catch(() => dispatch(setError("Failed to load products.")));
    }
  }, [allProducts, loading, error, dispatch]);

  // Filter + sort
  const filteredProducts = useMemo(() => {
    const selectedBrands = Object.keys(brandsFilter).filter(
      (b) => brandsFilter[b]
    );

    return allProducts
      .filter((p) => {
        if (!categoryParam) return true;
        if (categoryParam.includes("clothing"))
          return (
            p.category === "men's clothing" || p.category === "women's clothing"
          );
        return p.category.includes(categoryParam);
      })
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
      .filter((p) =>
        stockFilter.inStock || stockFilter.outOfStock
          ? stockFilter.inStock
            ? p.inStock
            : !p.inStock
          : true
      )
      .filter((p) =>
        selectedBrands.length ? selectedBrands.includes(p.brand) : true
      )
      .sort((a, b) => {
        if (sortBy === "price-low-high") return a.price - b.price;
        if (sortBy === "price-high-low") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [
    allProducts,
    categoryParam,
    priceRange,
    stockFilter,
    brandsFilter,
    sortBy,
  ]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (product) => {
  console.log("View details clicked for product:", product);
  setSelectedProduct(product); 
};

  const handleAddToCart = (product) => {
    const existing = cart.find((p) => p.id === product.id);
    dispatch(
      addToCart({ ...product, quantity: existing ? existing.quantity + 1 : 1 })
    );
    toast.success(existing ? "Cart updated!" : "Added to cart!");
  };

  const handleToggleWishlist = (product) => {
    const isIn = wishlist.some((p) => p.id === product.id);
    if (isIn) {
      dispatch(removeFromWishlist(product.id));
      toast.info("Removed from wishlist!");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist!");
    }
  };

  // Reset pagination when filters change
  useEffect(
    () => setCurrentPage(1),
    [categoryParam, priceRange, stockFilter, brandsFilter, sortBy, itemsPerPage]
  );

  return (
    <div className="py-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Filter By Price</h3>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-full accent-blue-500 mb-2"
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full accent-blue-500"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Price: ${priceRange[0]} – ${priceRange[1]}
          </p>

          <h3 className="text-lg font-semibold mb-4 mt-6">Stock Status</h3>
          {["inStock", "outOfStock"].map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stockFilter[key]}
                onChange={() =>
                  setStockFilter({ ...stockFilter, [key]: !stockFilter[key] })
                }
                className="accent-blue-500"
              />
              {key === "inStock" ? "In Stock" : "Out of Stock"}
            </label>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">Brands</h3>
          {defaultBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={brandsFilter[brand]}
                onChange={() =>
                  setBrandsFilter({
                    ...brandsFilter,
                    [brand]: !brandsFilter[brand],
                  })
                }
                className="accent-blue-500"
              />
              {brand.charAt(0).toUpperCase() + brand.slice(1)}
            </label>
          ))}
        </div>

        {/* Product List */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold">
              {categoryParam ? `Category: ${categoryParam}` : "All Products"}
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">Show:</span>
                {[9, 12, 18, 24].map((n) => (
                  <button
                    key={n}
                    onClick={() => setItemsPerPage(n)}
                    className={`px-2 py-1 rounded-md text-sm ${
                      itemsPerPage === n
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {n}
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
            <p className="text-center text-red-500 dark:text-red-400 py-6">
              {error}
            </p>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-semibold">No Products Available</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                No products match your current filters.
              </p>
              <button
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setStockFilter({ inStock: false, outOfStock: false });
                  setBrandsFilter(
                    defaultBrands.reduce(
                      (acc, b) => ({ ...acc, [b]: false }),
                      {}
                    )
                  );
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Shop;
