import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "aos/dist/aos.css";

import ProductCard from "../ProductCard/ProductCard";
import ProductFilters from "../ProductFilters/ProductFilters";
import CartPopup from "../CartPopup/CartPopup";
import WishlistPopup from "../WishlistPopup/WishlistPopup";
import ProductDetailsModal from "../ProductDetailsModal/ProductDetailsModal";

import {
  fetchProducts,
  setCurrentPage,
  selectAllProducts,
  selectLoading,
  selectError,
  selectCurrentPage,
} from "../../reducers/productsReducer";
import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../reducers/wishlistReducer";

const PRODUCTS_PER_PAGE = 5;

const Products = () => {
  const dispatch = useDispatch();

  // Redux state
  const allProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const currentPage = useSelector(selectCurrentPage);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Local state
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    if (!allProducts?.length && !loading && !error) {
      dispatch(fetchProducts())
        
    }
  }, [allProducts, loading, error, dispatch]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return (allProducts || []).filter((p) => {
      const price = Number(p.price) || 0;
      const rating = Number(p.rating) || 0;
      return (
        (!filters.category || p.category === filters.category.toLowerCase()) &&
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        rating >= filters.rating
      );
    });
  }, [allProducts, filters]);

  // Pagination
  const displayProducts = useMemo(() => {
    if (showAllProducts) return filteredProducts;
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage, showAllProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Handlers
  const handleAddToCart = useCallback(
    (product) => {
      const existing = cartItems.find((item) => item.id === product.id);
      dispatch(
        existing
          ? updateCartQuantity({
              id: product.id,
              quantity: existing.quantity + 1,
            })
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
      dispatch(
        exists ? removeFromWishlist(product.id) : addToWishlist(product)
      );
      toast.info(exists ? "Removed from wishlist!" : "Added to wishlist!");
      setShowWishlistPopup(true);
    },
    [dispatch, wishlistItems]
  );

  if (error) {
    return <p className="text-center text-red-500 p-4">{error}</p>;
  }

  return (
    <div id="Products" className="py-6 px-4 container mx-auto">
      {/* Filters */}
      <ProductFilters
        categoryFilter={filters.category}
        setCategoryFilter={(v) => setFilters({ ...filters, category: v })}
        priceRange={filters.priceRange}
        setPriceRange={(v) => setFilters({ ...filters, priceRange: v })}
        ratingFilter={filters.rating}
        setRatingFilter={(v) => setFilters({ ...filters, rating: v })}
      />

      {/* Products */}
      <ProductCard
        products={displayProducts}
        loading={loading}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onViewDetails={setSelectedProduct}
        wishlist={wishlistItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
        onToggleShowAll={() => {
          setShowAllProducts((prev) => !prev);
          if (showAllProducts) dispatch(setCurrentPage(1));
        }}
        showAllProducts={showAllProducts}
      />

      {/* Popups & Modals */}
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

export default Products;
