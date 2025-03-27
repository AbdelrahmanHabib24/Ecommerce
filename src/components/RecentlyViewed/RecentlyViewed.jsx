/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// components/RecentlyViewed/RecentlyViewed.jsx
import ProductCard from "../ProductCard/ProductCard";

const RecentlyViewed = ({ recentlyViewed, cart, setCart, wishlist, setWishlist, setCartPopup }) => {
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setCartPopup(true);
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === product.id)) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [...prevWishlist, product];
    });
  };

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recentlyViewed.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;