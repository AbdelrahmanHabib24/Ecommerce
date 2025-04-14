import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('wishlist')) || [], // استرجاع البيانات من LocalStorage
};

// يتم تخزين المفضلة في LocalStorage عند التحديث
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      state.items.push(action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items)); // حفظ في LocalStorage
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items)); // حفظ في LocalStorage
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem('wishlist'); // إزالة من LocalStorage
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
