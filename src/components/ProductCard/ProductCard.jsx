/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaEye,
} from "react-icons/fa";

// Constants for configuration
const CONFIG = {
  FALLBACK_IMAGE: "https://picsum.photos/180/220",
  CARD_WIDTH: "100%", // تغيير إلى قيمة نسبية لتكون متجاوبة
  CARD_HEIGHT: "auto", 
  IMAGE_WIDTH: "100%", 
  IMAGE_HEIGHT: "220px", 
};

// Render star ratings
const renderRatingStars = (rating) => {
  const roundedRating = Math.round(Number(rating) || 0);
  return Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? (
      <FaStar
        key={`star-${i}`}
        className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4"
        aria-label="Filled star"
      />
    ) : (
      <FaRegStar
        key={`star-${i}`}
        className="text-gray-300 dark:text-gray-500 w-3 h-3 sm:w-4 sm:h-4"
        aria-label="Empty star"
      />
    )
  );
};

// Skeleton loader for product cards
const ProductCardSkeleton = () => (
  <div
    className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full max-w-[200px] h-[370px] sm:max-w-[200px] sm:h-[370px] mx-auto"
  >
    <div
      className="bg-gray-300 dark:bg-gray-600 rounded-md mx-auto mt-4 w-[90%] max-w-[180px] h-[220px]"
    />
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto" />
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mx-auto" />
      <div className="flex justify-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-300 dark:bg-gray-600 rounded-full"
          />
        ))}
      </div>
    </div>
  </div>
);

const ProductCard = ({
  products = [],
  onAddToCart = () => {},
  onToggleWishlist = () => {},
  onViewDetails = () => {},
  wishlist = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onToggleShowAll = () => {},
  showAllProducts = false,
}) => {
  const handleAddToCart = useCallback(
    (product, e) => onAddToCart(product, e),
    [onAddToCart]
  );
  const handleToggleWishlist = useCallback(
    (product, e) => onToggleWishlist(product, e),
    [onToggleWishlist]
  );
  const handleViewDetails = useCallback(
    (product) => onViewDetails(product),
    [onViewDetails]
  );
  const handlePageChange = useCallback(
    (page) => onPageChange(page),
    [onPageChange]
  );

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 place-items-center"
        aria-live="polite"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div
        className="text-center py-6"
        role="alert"
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-duration="800"
        data-aos-once="true"
      >
        <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
          No Products Available
        </p>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
          There are no products to display.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Product Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 place-items-center"
        aria-live="polite"
      >
        {products.map((product, index) => {
          if (!product?.id) return null;

          const isInWishlist = wishlist.some((item) => item?.id === product.id);
          const price = Number(product.price) || 0;
          const originalPrice = product.originalPrice
            ? Number(product.originalPrice)
            : null;
          const discount =
            originalPrice && originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;
          const rating = Number(product.rating) || 0;
          const inStock = product.inStock ?? true;
          const title = product.title || "Untitled Product";
          const category = product.category?.toLowerCase() || "unknown";
          const image =
            product.img || CONFIG.CATEGORY_IMAGES?.[category] || CONFIG.FALLBACK_IMAGE;

          return (
            <article
              key={product.id}
              className="group relative bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[200px] h-auto sm:max-w-[200px] sm:h-[370px] mx-auto"
              role="region"
              aria-label={`Product: ${title}`}
              data-aos="fade-up"
              data-aos-delay={String(index * 100)}
              data-aos-duration="800"
              data-aos-once="true"
            >
              {/* Product Image and Discount */}
              <div className="relative">
                <Link
                  to={`/product/${product.id}`}
                  state={{ product }}
                  className="block"
                  aria-label={`View details for ${title}`}
                >
                  <img
                    src={image}
                    alt={`Image of ${title}`}
                    className="w-full max-w-[180px] h-[220px] object-fill rounded-md mb-2 sm:mb-3 mx-auto"
                    loading="lazy"
                    onError={(e) => (e.target.src = CONFIG.FALLBACK_IMAGE)}
                  />
                </Link>
                {discount > 0 && (
                  <span
                    className="absolute top-1 sm:top-2 left-1 sm:left-2 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-md"
                    style={{
                      backgroundColor: "rgba(255, 0, 0, 0.6)",
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
                    }}
                    data-aos="zoom-in"
                    data-aos-delay={String(index * 100 + 200)}
                    data-aos-duration="800"
                  >
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="text-center space-y-1 flex-1 flex flex-col justify-end">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">
                  {title}
                </h3>
                <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <div
                  className="flex justify-center items-center space-x-1"
                  aria-label={`Rating: ${rating} out of 5`}
                >
                  {renderRatingStars(rating)}
                </div>
                <p
                  className={`text-xs sm:text-sm font-medium ${inStock ? "text-green-500" : "text-red-500"}`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={!inStock}
                  className={`p-1.5 sm:p-2 rounded-full relative group/button ${inStock ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"}`}
                  aria-label={inStock ? "Add to cart" : "Out of stock"}
                  data-aos="fade-left"
                  data-aos-delay={String(index * 100 + 300)}
                  data-aos-duration="800"
                >
                  <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {!isInWishlist ? (
                  <button
                    onClick={(e) => handleToggleWishlist(product, e)}
                    className="p-1.5 sm:p-2 rounded-full relative group/button bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300"
                    aria-label="Add to wishlist"
                    data-aos="fade-left"
                    data-aos-delay={String(index * 100 + 400)}
                    data-aos-duration="800"
                  >
                    <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="p-1.5 sm:p-2 rounded-full relative group/button bg-blue-500 text-white hover:bg-blue-600"
                    aria-label="View product details"
                    data-aos="fade-left"
                    data-aos-delay={String(index * 100 + 400)}
                    data-aos-duration="800"
                  >
                    <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                {!isInWishlist && (
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="p-1.5 sm:p-2 rounded-full relative group/button bg-blue-500 text-white hover:bg-blue-600"
                    aria-label="View product details"
                    data-aos="fade-left"
                    data-aos-delay={String(index * 100 + 500)}
                    data-aos-duration="800"
                  >
                    <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="flex flex-wrap justify-center items-center mt-4 sm:mt-6 space-x-1 sm:space-x-2 gap-y-2"
          aria-label="Pagination"
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-duration="800"
          data-aos-once="true"
        >
          {!showAllProducts && (
            <>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
                aria-label="Previous page"
                data-aos="fade-up"
                data-aos-delay="700"
                data-aos-duration="800"
              >
                {loading && <span className="animate-spin mr-2">⏳</span>}
                Previous
              </button>
              <div className="flex flex-wrap space-x-1 sm:space-x-1 gap-y-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page, index) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      data-aos="zoom-in"
                      data-aos-delay={String(800 + index * 100)}
                      data-aos-duration="800"
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
                aria-label="Next page"
                data-aos="fade-up"
                data-aos-delay={String(800 + totalPages * 100)}
                data-aos-duration="800"
              >
                Next
                {loading && <span className="animate-spin ml-2">⏳</span>}
              </button>
            </>
          )}
          <button
            onClick={onToggleShowAll}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-orange-400 text-white rounded hover:bg-orange-500 text-sm sm:text-base"
            aria-label={
              showAllProducts ? "Show paginated products" : "View all products"
            }
            data-aos="fade-up"
            data-aos-delay={String(900 + totalPages * 100)}
            data-aos-duration="800"
          >
            {showAllProducts ? "Show Paginated" : "View All Products"}
          </button>
        </nav>
      )}
    </div>
  );
};

export default memo(ProductCard);