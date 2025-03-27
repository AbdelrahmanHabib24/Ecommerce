import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaShoppingCart, FaHeart, FaRedo, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable'; // Import for swipe functionality

const ProductDetails = ({ cart, setCart, wishlist, setWishlist, setCartPopup }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const imgRef = useRef(null);

  // Lazy loading for images using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  // Utility to clean image URLs
  const cleanImageUrl = useCallback((image) => {
    if (!image) return 'https://via.placeholder.com/400x400?text=No+Image';
    let url = image;
    if (Array.isArray(image)) {
      url = image[0] || '';
    }
    url = url.replace(/^\["|"\]$/g, '').replace(/\\"/g, '').trim();
    return url || 'https://via.placeholder.com/400x400?text=No+Image';
  }, []);

  // Fetch product details from API
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const data = await response.json();
      const formattedProduct = {
        ...data,
        title: data.title || 'Untitled Product',
        price: data.price || 0,
        originalPrice: data.originalPrice || data.price * 1.2,
        description: data.description || 'No description available.',
        category: data.category?.name  ,
        categoryId: data.category?.id || null,
        creationAt: data.creationAt || new Date().toISOString(),
        inStock: data.inStock !== undefined ? data.inStock : true,
        stockQuantity: data.stockQuantity || 10,
        images: data.images && data.images.length > 0 ? data.images : [],
        rating: data.rating || Math.random() * 5,
        reviewCount: data.reviewCount || Math.floor(Math.random() * 100),
      };
      setProduct(formattedProduct);
      setSelectedImageIndex(0);
      setLoading(false);

      if (formattedProduct.categoryId) {
        const relatedResponse = await fetch(
          `https://api.escuelajs.co/api/v1/products?categoryId=${formattedProduct.categoryId}`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.filter((item) => item.id !== parseInt(id)).slice(0, 4));
        }
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Add product to cart
  const handleAddToCart = useCallback(
    (product) => {
      if (product.stockQuantity && quantity > product.stockQuantity) {
        toast.error(`Only ${product.stockQuantity} items available in stock!`);
        return;
      }
      const existingProduct = cart.find((item) => item.id === product.id);
      const newProduct = {
        ...product,
        img: cleanImageUrl(product.images),
        quantity,
      };
      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        if (product.stockQuantity && newQuantity > product.stockQuantity) {
          toast.error(`Only ${product.stockQuantity} items available in stock!`);
          return;
        }
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          )
        );
        toast.success(`${product.title} quantity updated in cart!`);
      } else {
        setCart([...cart, newProduct]);
        toast.success(`${product.title} added to cart!`);
      }
      setCartPopup(false);
      setQuantity(1);
    },
    [cart, setCart, setCartPopup, quantity, cleanImageUrl]
  );

  // Toggle product in wishlist
  const handleToggleWishlist = useCallback(
    (product) => {
      const isInWishlist = wishlist.some((item) => item.id === product.id);
      const newProduct = {
        ...product,
        img: cleanImageUrl(product.images),
      };
      if (isInWishlist) {
        setWishlist(wishlist.filter((item) => item.id !== product.id));
        toast.info(`${product.title} removed from wishlist!`);
      } else {
        setWishlist([...wishlist, newProduct]);
        toast.success(`${product.title} added to wishlist!`);
      }
    },
    [wishlist, setWishlist, cleanImageUrl]
  );

  // Change main image
  const handleImageChange = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  // Navigate to previous image
  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? (product.images.length > 0 ? product.images.length - 1 : 0) : prev - 1
    );
  }, [product]);

  // Navigate to next image
  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === (product.images.length > 0 ? product.images.length - 1 : 0) ? 0 : prev + 1
    );
  }, [product]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextImage(),
    onSwipedRight: () => handlePrevImage(),
    trackMouse: true, // Allow swipe with mouse for testing on desktop
  });

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading product details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={fetchProduct}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaRedo className="mr-2" />
            Retry
          </button>
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        <p>Product not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const selectedImage = product.images.length > 0 ? cleanImageUrl(product.images[selectedImageIndex]) : null;
  const hasDiscount = product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen py-10"
    >
      <div className="container mx-auto px-4">
        {/* Back to Products Link */}
        <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4" ref={imgRef}>
            <div className="relative w-full h-[400px] rounded-lg shadow-md overflow-hidden">
              <AnimatePresence mode="wait">
                {isVisible && selectedImage ? (
                  <motion.img
                    key={selectedImageIndex}
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    loading="lazy"
                    onClick={() => setIsImageModalOpen(true)}
                    onError={() => {
                      if (product.images.length > 1) {
                        setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
                      } else {
                        setSelectedImageIndex(0);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No image available</p>
                  </div>
                )}
              </AnimatePresence>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => {
                  const cleanImage = cleanImageUrl(image);
                  return (
                    <motion.img
                      key={index}
                      src={cleanImage}
                      alt={`${product.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200 ${
                        selectedImageIndex === index ? 'border-2 border-blue-500' : ''
                      }`}
                      onClick={() => handleImageChange(index)}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/80x80?text=No+Image')}
                      loading="lazy"
                      whileHover={{ scale: 1.05 }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg line-through text-gray-500 dark:text-gray-400">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-green-500">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
           
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rating: {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </div>
            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
            <p className="text-sm font-medium">
              Category: <span className="text-gray-600 dark:text-gray-400">{product.category}</span>
            </p>
            <p className="text-sm font-medium">
              Added on: <span className="text-gray-600 dark:text-gray-400">{new Date(product.creationAt).toLocaleDateString()}</span>
            </p>
            <p
              className={`text-sm font-medium ${
                product.inStock ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 dark:text-gray-300">Quantity:</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 text-gray-900 dark:text-gray-100">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(product.stockQuantity, prev + 1))}
                  className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(product)}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                disabled={!product.inStock}
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleWishlist(product)}
                className={`px-6 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  isInWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <FaHeart />
                <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsImageModalOpen(false)}
            >
              <motion.div
                className="relative w-full max-w-[90vw] h-[80vh] sm:h-[85vh] max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                {...swipeHandlers} // Add swipe handlers
              >
                {/* Image */}
                <motion.img
                  key={selectedImageIndex}
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-t-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  loading="lazy"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/400x400?text=No+Image')}
                />

                {/* Close Button */}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-gray-900 bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
                  aria-label="Close Modal"
                >
                  <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Navigation Buttons */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
                      aria-label="Previous Image"
                    >
                      <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
                      aria-label="Next Image"
                    >
                      <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Image Indicator */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded-full text-sm sm:text-base">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={cleanImageUrl(relatedProduct.images[0])}
                    alt={relatedProduct.title}
                    className="w-full h-[150px] object-cover rounded-md mb-4"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150x150?text=No+Image')}
                  />
                  <h3 className="text-lg font-semibold truncate">{relatedProduct.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// PropTypes for validation
ProductDetails.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      img: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      stockQuantity: PropTypes.number,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      img: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      stockQuantity: PropTypes.number,
    })
  ).isRequired,
  setWishlist: PropTypes.func.isRequired,
  setCartPopup: PropTypes.func.isRequired,
};

export default ProductDetails;