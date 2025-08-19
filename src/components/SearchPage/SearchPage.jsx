/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";

import ProductCard from "../ProductCard/ProductCard";
import CartPopup from "../CartPopup/CartPopup";
import WishlistPopup from "../WishlistPopup/WishlistPopup";

import { FaSpinner } from "react-icons/fa";

import {
  fetchProducts,
  selectAllProducts,
  selectLoading,
  selectError,
} from "../../reducers/productsReducer";

import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";
import { addToWishlist, removeFromWishlist } from "../../reducers/wishlistReducer";
import ProductDetailsModal from "../ProductDetailsModal/ProductDetailsModal";

const SearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Redux state
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  // Local filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [selectedProduct, setSelectedProduct] = useState(null);

  const [stockFilter, setStockFilter] = useState("all");
  const [brandsFilter, setBrandsFilter] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Popups
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Fetch products
  useEffect(() => {
    if (!products?.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  // Get query from URL
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Filtering + sorting
  const filteredProducts = useMemo(() => {
    if (!products?.length) return [];

    let result = [...products];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Price filter
    const minPrice = priceRange?.[0] ?? 0;
    const maxPrice = priceRange?.[1] ?? Infinity;
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Stock filter
    if (stockFilter === "in") result = result.filter((p) => p.inStock);
    if (stockFilter === "out") result = result.filter((p) => !p.inStock);

    // Brands filter
    if (brandsFilter.length)
      result = result.filter((p) => brandsFilter.includes(p.brand));

    // Sorting
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, searchQuery, priceRange, stockFilter, brandsFilter, sortBy]);

  // Handlers
  const handleAddToCart = useCallback(
    (product) => {
      const existing = cartItems.find((item) => item.id === product.id);
      dispatch(
        existing
          ? updateCartQuantity({ id: product.id, quantity: existing.quantity + 1 })
          : addToCart({ ...product, quantity: 1 })
      );
      toast.success(existing ? "Cart updated!" : "Added to cart!");
      setShowCartPopup(true);
    },
    [dispatch, cartItems]
  );

  const handleToggleWishlist = useCallback(
    (product) => {
      const exists = wishlistItems.some((item) => item.id === product.id);
      dispatch(exists ? removeFromWishlist(product.id) : addToWishlist(product));
      toast.info(exists ? "Removed from wishlist!" : "Added to wishlist!");
      setShowWishlistPopup(true);
    },
    [dispatch, wishlistItems]
  );

const handleViewDetails = (product) => {
  setSelectedProduct(product); 
};
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4" data-aos="fade-right">
        Search Results
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-gray-500" />
        </div>
      )}

      {error && <div className="text-center text-red-500 py-10">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">No products available.</p>
      )}

      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500">No products match your filters.</p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div data-aos="fade-up">
          <ProductCard
            products={filteredProducts}
            wishlist={wishlistItems}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails} // does nothing
          />
        </div>
      )}

      {/* Popups */}
      {showCartPopup && (
        <CartPopup cart={cartItems} onClose={() => setShowCartPopup(false)} />
      )}
      {showWishlistPopup && (
        <WishlistPopup
          wishlist={wishlistItems}
          onClose={() => setShowWishlistPopup(false)}
        />
      )}
       {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
    
  );
};

export default SearchPage;
