/* eslint-disable react/prop-types */
import { useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaEye,
} from "react-icons/fa";

const renderStars = (rating = 0) =>
  Array.from({ length: 5 }, (_, i) =>
    i < Math.round(rating) ? (
      <FaStar key={i} className="text-yellow-400 w-4 h-4" />
    ) : (
      <FaRegStar key={i} className="text-gray-300 dark:text-gray-500 w-4 h-4" />
    )
  );

const ProductCard = ({
  products = [],
  wishlist = [],
  currentPage = 1,
  totalPages = 1,
  showAllProducts = false,
  onAddToCart = () => {},
  onToggleWishlist = () => {},
  onViewDetails = () => {},
  onPageChange = () => {},
  onToggleShowAll = () => {},
}) => {
  const handleAddToCart = useCallback(onAddToCart, [onAddToCart]);
  const handleToggleWishlist = useCallback(onToggleWishlist, [
    onToggleWishlist,
  ]);
  const handleViewDetails = useCallback(onViewDetails, [onViewDetails]);

  // Empty State
  if (!products.length) {
    return (
      <div className="text-center py-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          No Products Available
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          There are no products to display.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 place-items-center">
        {products.map((p) => {
          const {
            id,
            title = "Untitled Product",
            price = 0,
            originalPrice,
            discount = 0,
            rating = 0,
            inStock = true,
            image,
          } = p;

          const isInWishlist = wishlist.some((item) => item?.id === id);

          return (
            <article
              key={id}
              className="group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[200px] h-[370px] mx-auto"
            >
              {/* Product Image */}
              <div className="relative">
                <Link to={`/product/${id}`} state={{ product: p }}>
                  <img
                    src={image}
                    alt={title}
                    className="w-full max-w-[180px] h-[220px] object-fill rounded-md mb-3 mx-auto"
                  />
                </Link>
                {discount > 0 && (
                  <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md bg-red-500/70">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                  {title}
                </h3>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${price.toFixed(2)}
                  </span>
                  {discount > 0 && originalPrice && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex justify-center">{renderStars(rating)}</div>
                <p
                  className={`text-xs font-medium ${
                    inStock ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleAddToCart(p, e)}
                  disabled={!inStock}
                  className={`p-2 rounded-full ${
                    inStock
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaShoppingCart className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => handleToggleWishlist(p, e)}
                  className={`p-2 rounded-full ${
                    isInWishlist
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {isInWishlist ? (
                    <FaRegHeart className="w-5 h-5" />
                  ) : (
                    <FaRegHeart className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={(e) => handleViewDetails(p, e)}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
                >
                  <FaEye className="w-5 h-5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex flex-wrap justify-center items-center mt-6 gap-2">
          {!showAllProducts && (
            <>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </>
          )}
          <button
            onClick={onToggleShowAll}
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
          >
            {showAllProducts ? "Show Paginated" : "View All Products"}
          </button>
        </nav>
      )}
    </div>
  );
};

export default ProductCard;
