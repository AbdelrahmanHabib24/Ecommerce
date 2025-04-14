import { useCallback, useEffect, useMemo, useState } from "react";
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
  setError,
} from "../../reducers/productsReducer";
import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";
import { addToWishlist, removeFromWishlist } from "../../reducers/wishlistReducer";

const Products = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const currentPage = useSelector(selectCurrentPage);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const PRODUCTS_PER_PAGE = 5;

  // Initialize AOS
  
  // Fetch products if not already loaded
  useEffect(() => {
    if (!allProducts?.length && !loading && !error) {
      dispatch(fetchProducts())
        .unwrap()
        .catch(() => {
          dispatch(setError("Failed to load products."));
          dispatch({ type: "products/setAllProducts" });
        });
    }
  }, [allProducts, loading, error, dispatch]);

  // Format product data
  const formatProduct = useCallback((product) => {
    const price = Number(product.price) || 0;
    const category = product.category?.toLowerCase() || "uncategorized";
    const colorMap = {
      electronics: ["Silver", "Black"],
      "men's clothing": ["Blue", "Gray"],
      "women's clothing": ["Pink", "White"],
      jewelery: ["Gold", "Silver"],
    };
    const colors = colorMap[category] || ["Black"];
    const discount = Math.random() * 0.2 + 0.1;

    return {
      ...product,
      img: product.image?.startsWith("http") ? product.image : "",
      rating: Number(product.rating?.rate || product.rating) || Math.max(1, Math.min(5, Math.floor(Math.random() * 5 + 1))),
      color: colors[Math.floor(Math.random() * colors.length)],
      originalPrice: price / (1 - discount),
      inStock: product.inStock ?? price < 300,
      category,
    };
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || !allProducts.length) return [];

    const formattedProducts = allProducts.map(formatProduct);
    return formattedProducts.filter((p) => {
      const matchesCategory = categoryFilter === "" || p.category === categoryFilter.toLowerCase();
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRating = p.rating >= ratingFilter;
      return matchesCategory && matchesPrice && matchesRating;
    });
  }, [allProducts, categoryFilter, priceRange, ratingFilter, formatProduct]);

  // Paginate products or show all
  const displayProducts = useMemo(() => {
    if (!Array.isArray(filteredProducts)) return []; // فحص دفاعي
    if (showAllProducts) return filteredProducts;
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage, showAllProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Handlers
  const handleAddToCart = useCallback((product, e) => {
    e.preventDefault();
    const existing = cartItems.find((item) => item.id === product.id);
    dispatch(existing ? updateCartQuantity({ id: product.id, quantity: existing.quantity + 1 }) : addToCart({ ...product, quantity: 1 }));
    toast.success(existing ? "Cart updated!" : "Added to cart!");
    setShowCartPopup(true);
  }, [dispatch, cartItems]);

  const handleToggleWishlist = useCallback((product, e) => {
    e.preventDefault();
    const exists = wishlistItems.some((item) => item.id === product.id);
    dispatch(exists ? removeFromWishlist(product.id) : addToWishlist(product));
    toast.info(exists ? "Removed from wishlist!" : "Added to wishlist!");
    setShowWishlistPopup(true);
  }, [dispatch, wishlistItems]);

  const handleViewDetails = useCallback((product) => setSelectedProduct(product), []);

  const handlePageChange = useCallback((page) => dispatch(setCurrentPage(page)), [dispatch]);

  const handleToggleShowAll = useCallback(() => {
    setShowAllProducts((prev) => !prev);
    if (showAllProducts) dispatch(setCurrentPage(1));
  }, [showAllProducts, dispatch]);

  if (error) return (
    <p
      className="text-center text-red-500 text-sm sm:text-base p-4"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      {error}
    </p>
  );

  return (
    <div id="Products" className="py-4 sm:py-8 px-2 sm:px-4 container mx-auto">
      <div
        className="mb-4 sm:mb-6"
        data-aos="fade-down"
        data-aos-delay="50"
        data-aos-duration="800"
        data-aos-once="true"
      >
        <ProductFilters
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />
      </div>
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-duration="800"
        data-aos-once="true"
      >
        <ProductCard
          products={displayProducts}
          loading={loading}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onViewDetails={handleViewDetails}
          wishlist={wishlistItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onToggleShowAll={handleToggleShowAll}
          showAllProducts={showAllProducts}
        />
      </div>
      {showCartPopup && (
        <div
          data-aos="zoom-in"
          data-aos-delay="50"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <CartPopup cart={cartItems} onClose={() => setShowCartPopup(false)} />
        </div>
      )}
      {showWishlistPopup && (
        <div
          data-aos="zoom-in"
          data-aos-delay="50"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <WishlistPopup wishlist={wishlistItems} onClose={() => setShowWishlistPopup(false)} />
        </div>
      )}
      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default Products;