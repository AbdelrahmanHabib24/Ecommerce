/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaEye, FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onViewDetails, onAddToCart, onToggleWishlist, wishlist, observer }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const observerRef = useRef(null);

  // استخدام IntersectionObserver المُمرر أو إنشاء واحد محلي
  useEffect(() => {
    if (!cardRef.current) return;

    const currentObserver = observer || new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "200px" } // زيادة rootMargin لتحميل الصور مبكرًا
    );

    observerRef.current = currentObserver;
    observerRef.current.observe(cardRef.current);

    return () => {
      if (observerRef.current && cardRef.current) {
        observerRef.current.unobserve(cardRef.current);
        observerRef.current.disconnect();
      }
    };
  }, [observer]);

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 dark:text-gray-500" />
        )
      );
    }
    return stars;
  };

  // التأكد من أن الصورة صالحة قبل محاولة تحميلها
  const displayImage = imageError || !product.img || product.img === ""
    ? "https://via.placeholder.com/150?text=Image+Not+Found"
    : product.img;

  // صورة منخفضة الجودة (LQIP) كبديل مؤقت
  const placeholderImage = "https://via.placeholder.com/50?text=Loading"; // صورة صغيرة الحجم

  return (
    <div
      ref={cardRef}
      data-product-id={product.id}
      data-aos="zoom-in-up"
      data-aos-delay={product.aosDelay || "0"}
      className="group relative space-y-3 w-[200px] h-[400px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-between"
    >
      <div className="relative">
        {!imageLoaded && (
          <div className="h-[220px] w-[150px] mx-auto rounded-md overflow-hidden">
            <img
              src={placeholderImage}
              alt="Loading placeholder"
              className="h-full w-full object-cover rounded-md filter blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            </div>
          </div>
        )}
        <Link to={`/product/${product.id}`}>
          <img
            src={displayImage}
            alt={product.title || "Product"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`h-[220px] w-[180px] object-cover rounded-md mx-auto transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        </Link>
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
          {product.title || "Unnamed Product"}
        </h3>
        <div className="flex justify-center items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            ${product.price?.toFixed(2) || "N/A"}
          </p>
          {discountPercentage > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.originalPrice?.toFixed(2) || "N/A"}
            </p>
          )}
        </div>
        <div className="flex justify-center items-center space-x-1">
          {renderRatingStars(product.rating || 0)}
        </div>
        <p
          className={`text-sm font-medium ${
            product.inStock ? "text-green-500" : "text-red-500"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onViewDetails(product)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          title="View Details"
          aria-label={`View details of ${product.title}`}
        >
          <FaEye />
        </button>
        <button
          onClick={() => onAddToCart(product)}
          className={`p-2 rounded-full transition-colors ${
            product.inStock
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
          title={product.inStock ? "Add to Cart" : "Out of Stock"}
          disabled={!product.inStock}
          aria-label={product.inStock ? `Add ${product.title} to cart` : `${product.title} is out of stock`}
        >
          <FaShoppingCart />
        </button>
        <button
          onClick={() => onToggleWishlist(product)}
          className={`p-2 rounded-full transition-colors ${
            isInWishlist
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isInWishlist ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        >
          {isInWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    title: PropTypes.string,
    rating: PropTypes.number,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    inStock: PropTypes.bool,
    category: PropTypes.string,
    description: PropTypes.string,
    aosDelay: PropTypes.string,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleWishlist: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  observer: PropTypes.instanceOf(IntersectionObserver),
};

export default ProductCard;