/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import { addToWishlist, removeFromWishlist } from "../../reducers/wishlistReducer";
import { setCartPopup } from "../../reducers/popupsReducer";
import { addToCart, updateCartQuantity } from "../../reducers/cartReducer";

const RecentlyViewed = () => {
  const dispatch = useDispatch();
  const recentlyViewed = useSelector((state) => state.recentlyViewed.items);
  const cart = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist.items);

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      dispatch(updateCartQuantity({ id: product.id, quantity: existingItem.quantity + 1 }));
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }

    dispatch(setCartPopup(true));
    setTimeout(() => dispatch(setCartPopup(false)), 2000);
  };

  const handleToggleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    dispatch(isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product));
  };

  if (!recentlyViewed?.length) return null;

  return (
    <div className="py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recentlyViewed.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onToggleWishlist={() => handleToggleWishlist(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
