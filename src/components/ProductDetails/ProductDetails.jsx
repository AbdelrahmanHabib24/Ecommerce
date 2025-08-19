/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from "react";
import { useParams, Link ,useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaShoppingCart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";
import { addToWishlist } from "../../reducers/wishlistReducer";
import { selectAllProducts, fetchProducts } from "../../reducers/productsReducer";



// ---------------- Image Gallery ----------------
const ImageGallery = ({
  images,
  selectedImageIndex,
  onImageChange,
  onPrev,
  onNext,
  onModalOpen,
}) => {
  const selectedImage = images.length > 0 ? images[selectedImageIndex] : "";

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square max-h-[450px] rounded-lg shadow-md overflow-hidden">
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-full object-contain rounded-lg cursor-pointer transition-opacity duration-300"
          onClick={onModalOpen}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-opacity-75"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full hover:bg-opacity-75"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto py-2">
          {images.map((image, i) => (
            <img
              key={i}
              src={image }
              alt={`Thumbnail ${i + 1}`}
              onClick={() => onImageChange(i)}
              className={`w-16 h-16 object-contain rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-110 ${
                selectedImageIndex === i
                  ? "border-2 border-blue-500 opacity-100"
                  : "opacity-70 hover:opacity-90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------- Product Details ----------------
const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const allProducts = useSelector(selectAllProducts);
  const cart = useSelector((s) => s.cart.items);
  const wishlist = useSelector((s) => s.wishlist?.items || []);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // -------- Product & Related Products from Redux --------
 const location = useLocation();
const stateProduct = location.state?.product;

const product = useMemo(
  () => stateProduct || allProducts.find((p) => p.id === Number(id)),
  [allProducts, id, stateProduct]
);
  useEffect(() => {
  if (!product) {
    dispatch(fetchProducts()); 
  }
}, [dispatch, id, product]);

 const productWithDefaults = {
  ...product,
  inStock: product?.inStock ?? true,
  stockQuantity: product?.stockQuantity ?? 10,
  images: product?.images?.length ? product.images : [product?.image ],
  price: product?.price ?? 0,
  originalPrice: product?.originalPrice ?? product?.price ?? 0,
};


  const relatedProducts = useMemo(
    () =>
      allProducts
        .filter(
          (p) =>
            p.category === productWithDefaults.category &&
            p.id !== productWithDefaults.id
        )
        .slice(0, 4),
    [allProducts, productWithDefaults]
  );

  useEffect(() => {
    if (product) setLoadingProduct(false);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    const stockQty = productWithDefaults.stockQuantity;
    const isAvailable = productWithDefaults.inStock;

    if (!isAvailable) return toast.error("Product is out of stock!");
    if (quantity > stockQty)
      return toast.error(`Only ${stockQty} items available in stock!`);

    const existing = cart.find((i) => i.id === product.id);
    const item = {
      ...product,
      image: productWithDefaults.images[0],
      quantity,
    };

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > stockQty)
        return toast.error(`Only ${stockQty} items available in stock!`);
      dispatch(updateCartQuantity({ id: product.id, quantity: newQty }));
      toast.success(`${product.title} quantity updated!`);
    } else {
      dispatch(addToCart(item));
      toast.success(`${product.title} added to cart!`);
    }

    setQuantity(1);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    dispatch(
      addToWishlist({
        ...product,
        image: productWithDefaults.images[0],
      })
    );
    toast.success(`${product.title} added to wishlist!`);
  };

  const handlePrev = () =>
    setSelectedImageIndex((i) =>
      i === 0 ? productWithDefaults.images.length - 1 : i - 1
    );
  const handleNext = () =>
    setSelectedImageIndex((i) =>
      i === productWithDefaults.images.length - 1 ? 0 : i + 1
    );

  const { isInWishlist, hasDiscount, discountPercentage } = useMemo(() => {
    if (!product) return {};
    const isInWishlist = wishlist.some((i) => i.id === product.id);
    const hasDiscount = product.originalPrice > product.price;
    const discountPercentage = hasDiscount
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;
    return { isInWishlist, hasDiscount, discountPercentage };
  }, [product, wishlist]);

  if (!product && loadingProduct)
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        <p>Loading product...</p>
      </div>
    );

  if (!product && !loadingProduct)
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        <p>Product not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="text-blue-500 hover:underline mb-6 inline-block"
        >
          ← Back to Products
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageGallery
            images={productWithDefaults.images}
            selectedImageIndex={selectedImageIndex}
            onImageChange={setSelectedImageIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onModalOpen={() => setIsImageModalOpen(true)}
          />

          <div className="space-y-5">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">${product.price}</span>
              {hasDiscount && (
                <>
                  <span className="line-through text-gray-500">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-green-500 text-sm">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rating:{" "}
              {typeof product.rating === "number"
                ? product.rating.toFixed(1)
                : product.rating?.rate?.toFixed(1) || "N/A"}{" "}
              ⭐
            </div>
            <p className="text-sm">Description: {product.description}</p>
            <p className="text-sm">Category: {product.category}</p>
            <p className="text-sm">
              Added on:{" "}
              {product.creationAt
                ? new Date(product.creationAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p
              className={`text-sm ${
                productWithDefaults.inStock ? "text-green-500" : "text-red-500"
              }`}
            >
              {productWithDefaults.inStock
                ? `In Stock (${productWithDefaults.stockQuantity} available)`
                : "Out of Stock"}
            </p>

            <div className="flex items-center space-x-3">
              <label>Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(productWithDefaults.stockQuantity, q + 1)
                    )
                  }
                  disabled={quantity >= productWithDefaults.stockQuantity}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!productWithDefaults.inStock}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 flex items-center space-x-2"
              >
                <FaShoppingCart /> <span>Add to Cart</span>
              </button>
              {!isInWishlist && (
                <button
                  onClick={handleAddToWishlist}
                                        className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <FaHeart /> <span>Add to Wishlist</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="p-4 rounded-lg shadow-md hover:shadow-xl dark:bg-gray-800 transition-transform hover:-translate-y-1"
                >
                  <img
                    src={p.images?.[0] || p.image }
                    alt={p.title}
                    className="w-full h-48 object-contain rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    ${p.price.toFixed(2)}
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
