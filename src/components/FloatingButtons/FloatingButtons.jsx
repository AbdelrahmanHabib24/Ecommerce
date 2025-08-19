import { useDispatch, useSelector } from "react-redux";
import { setCartPopup, setWishlistPopup } from "../../reducers/popupsReducer";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

export default function FloatingButtons() {
  const dispatch = useDispatch();
  const cartLength = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistLength = useSelector((state) => state.wishlist?.items?.length || 0);

  const handleOpenPopup = (type) => {
    dispatch(type === "CART" ? setCartPopup(true) : setWishlistPopup(true));
  };

  return (
    <nav
      className="fixed right-4 top-20 z-50 flex flex-col gap-4 sm:gap-5"
      data-aos="fade-left"
      data-aos-delay="300"
    >
      <button
        onClick={() => handleOpenPopup("CART")}
        className="p-3 sm:p-4 bg-blue-500 text-white rounded-full relative hover:scale-110 transition-transform"
        aria-label={`Open cart with ${cartLength} items`}
      >
        <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {cartLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartLength}
          </span>
        )}
      </button>

      <button
        onClick={() => handleOpenPopup("WISHLIST")}
        className="p-3 sm:p-4 bg-purple-500 text-white rounded-full relative hover:scale-110 transition-transform"
        aria-label={`Open wishlist with ${wishlistLength} items`}
      >
        <FaHeart className="w-5 h-5 sm:w-6 sm:h-6" />
        {wishlistLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlistLength}
          </span>
        )}
      </button>
    </nav>
  );
}
