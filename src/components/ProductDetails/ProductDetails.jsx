/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "aos/dist/aos.css";
import { FaShoppingCart, FaHeart, FaRedo, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSwipeable } from "react-swipeable";
import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";
import { addToWishlist } from "../../reducers/wishlistReducer"; 

const FALLBACK_IMAGE = "https://picsum.photos/180/220";


// Lazy-loaded image component
const LazyImage = ({ src, alt, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => imgRef.current && observer.unobserve(imgRef.current);
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : FALLBACK_IMAGE}
      alt={alt}
      className={className}
      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
      loading="lazy"
    />
  );
};



// Image gallery component
const ImageGallery = ({ images, selectedImageIndex, onImageChange, onPrev, onNext, onModalOpen }) => {
  const selectedImage = useMemo(
    () => (images.length > 0 ? images[selectedImageIndex] : FALLBACK_IMAGE),
    [images, selectedImageIndex]
  );

  return (
    <div className="space-y-4">
      <div
        className="relative w-full aspect-square max-h-[300px] sm:max-h-[400px] md:max-h-[450px] rounded-lg shadow-md overflow-hidden"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        data-aos-once="true"
      >
        <img
          src={selectedImage}
          alt="Product image"
          className="w-full h-full object-contain mask-transparent rounded-lg cursor-pointer transition-opacity duration-300"
          onClick={onModalOpen}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-200"
              aria-label="Previous image"
              data-aos="fade-right"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-200"
              aria-label="Next image"
              data-aos="fade-left"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto py-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 object-contain mask-transparent rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 ${
                selectedImageIndex === index ? "border-2 border-blue-500 opacity-100" : "opacity-70 hover:opacity-90"
              }`}
              onClick={() => onImageChange(index)}
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
              data-aos="fade-right"
              data-aos-delay={String( index * 600)}
              data-aos-duration="800"
            />
          ))}
        </div>
      )}
    </div>
  );
};



const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const cart = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist?.items || []);



  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product details");
      const data = await response.json();
      const formattedProduct = {
        ...data,
        title: data.title || "Untitled Product",
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice || Number(data.price) * 1.2,
        description: data.description || "No description available.",
        category: data.category || "Uncategorized",
        inStock: data.inStock !== undefined ? data.inStock : true,
        stockQuantity: data.stockQuantity || 10,
        img:data.image,
        images: data.image ? [data.image] : [],
        rating: data.rating?.rate || 0,
        creationAt: data.creationAt || new Date().toISOString(),
      };
      setProduct(formattedProduct);

      const relatedResponse = await fetch(
        `https://fakestoreapi.com/products/category/${formattedProduct.category}`
      );
      if (!relatedResponse.ok) throw new Error("Failed to fetch related products");
      const relatedData = await relatedResponse.json();
      setRelatedProducts(
        relatedData
          .filter((item) => item.id !== parseInt(id))
          .slice(0, 4)
          .map((item) => ({
            ...item,
            img: item.image,
            images: item.image ? [item.image] : [],
            rating: item.rating?.rate || 0,
          }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stockQuantity && quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items available in stock!`);
      return;
    }
    const existingItem = cart.find((item) => item.id === product.id);
    const newProduct = {
      ...product,
      image: product.img,
      quantity,
    };
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stockQuantity && newQuantity > product.stockQuantity) {
        toast.error(`Only ${product.stockQuantity} items available in stock!`);
        return;
      }
      dispatch(updateCartQuantity({ id: product.id, quantity: newQuantity }));
      toast.success(`${product.title} quantity updated in cart!`);
    } else {
      dispatch(addToCart(newProduct));
      toast.success(`${product.title} added to cart!`);
    }
    setQuantity(1);
  };

  const handleAddToWishlist = () => {
    const newProduct = {
      ...product,
      image:product.img,
    };
    dispatch(addToWishlist(newProduct));
    toast.success(`${product.title} added to wishlist!`);
  };

  const handleImageChange = (index) => setSelectedImageIndex(index);
  const handlePrevImage = () =>
    product?.images?.length &&
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  const handleNextImage = () =>
    product?.images?.length &&
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
  });

  const memoizedProductDetails = useMemo(() => {
    if (!product) return null;
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    const hasDiscount = product.originalPrice > product.price;
    const discountPercentage = hasDiscount
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    return { isInWishlist, hasDiscount, discountPercentage };
  }, [product, wishlist]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"
          data-aos="zoom-in"
          data-aos-duration="800"
        ></div>
        <p
          className="mt-2 text-gray-600 dark:text-gray-400"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          Loading product details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={fetchProduct}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            <FaRedo className="mr-2 inline" /> Retry
          </button>
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !memoizedProductDetails) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        <p>Product not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const { isInWishlist, hasDiscount, discountPercentage } = memoizedProductDetails;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen py-6 sm:py-10">
      <div className="container mx-auto px-4">
        {/* Back to Products Link */}
        <Link
          to="/"
          className="text-blue-500 hover:underline mb-4 sm:mb-6 inline-block text-sm sm:text-base"
          data-aos="fade-right"
          data-aos-delay="50"
          data-aos-duration="800"
        >
          ← Back to Products
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <ImageGallery
            images={product.images}
            selectedImageIndex={selectedImageIndex}
            onImageChange={handleImageChange}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            onModalOpen={() => setIsImageModalOpen(true)}
          />
          <div
            className="space-y-4 sm:space-y-5"
            data-aos="fade-left"
            data-aos-delay="200"
            data-aos-duration="600"
            data-aos-once="true"
          >
            <h1 className="text-2xl sm:text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-semibold">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm sm:text-lg line-through text-gray-500">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs sm:text-sm text-green-500">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Rating: {product.rating.toFixed(1)} ⭐
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Description: {product.description}
            </p>
            <p className="text-xs sm:text-sm">
              Category: <span className="text-gray-600 dark:text-gray-400">{product.category}</span>
            </p>
            <p className="text-xs sm:text-sm">
              Added on: <span className="text-gray-600 dark:text-gray-400">{new Date(product.creationAt).toLocaleDateString()}</span>
            </p>
            <p
              className={`text-xs sm:text-sm ${product.inStock ? "text-green-500" : "text-red-500"}`}
            >
              {product.inStock
                ? `In Stock (${product.stockQuantity} available)`
                : "Out of Stock"}
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-2 sm:px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-sm sm:text-base"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 sm:px-4 py-1 text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stockQuantity, prev + 1))
                  }
                  className="px-2 sm:px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-sm sm:text-base"
                  disabled={quantity >= product.stockQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-600 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform duration-200"
                disabled={!product.inStock}
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="800"
                aria-label="Add to cart"
              >
                <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                <span>Add to Cart</span>
              </button>
              {!isInWishlist && (
                <button
                  onClick={handleAddToWishlist}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 sm:px-6 py-2 rounded-md flex items-center justify-center space-x-2 text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform duration-200"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  data-aos-duration="800"
                  aria-label="Add to wishlist"
                >
                  <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
                  <span>Add to Wishlist</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-2 sm:p-6 transition-opacity duration-300"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[90vw] max-h-[90vh] rounded-xl overflow-hidden flex items-center justify-center transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
              {...swipeHandlers}
            >
              <LazyImage
                src={
                  product.images.length > 0
                    ? product.images[selectedImageIndex] 
                    : FALLBACK_IMAGE
                }
                alt={product.title}
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-xl"
              />
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-2 sm:top-0 right-2 sm:right-4 bg-gray-900 bg-opacity-70 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-90 transition-opacity duration-200"
                aria-label="Close image modal"
              >
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-opacity duration-200"
                    aria-label="Previous image in modal"
                  >
                    <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-opacity duration-200"
                    aria-label="Next image in modal"
                  >
                    <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div
            className="mt-8 sm:mt-12"
            data-aos="fade-up"
            data-aos-delay="500"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="p-3 sm:p-4 rounded-lg shadow-md  hover:shadow-xl dark:bg-gray-800 transition-transform duration-200 hover:-translate-y-1"
                  data-aos="fade-up"
                  data-aos-delay={String(600 + index * 100)}
                  data-aos-duration="800"
                >
                  <LazyImage
                    src={relatedProduct.img}
                    alt={relatedProduct.title}
                    className="w-full h-40 sm:h-48 mask-transparent md:h-56 object-contain rounded-md mb-3 sm:mb-4"
                  />
                  <h3 className="text-sm sm:text-lg font-semibold truncate">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default ProductDetails;