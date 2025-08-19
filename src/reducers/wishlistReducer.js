import { createSlice } from '@reduxjs/toolkit';



const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    addToWishlist: (state, { payload }) => {
      const product = payload;
      if (!state.items.some(item => item.id === product.id)) {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, { payload }) => {
      state.items = state.items.filter(item => item.id !== payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
