// cartReducer.js
import { createSlice } from "@reduxjs/toolkit";




const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          img:
            newItem.img ||
            newItem.image ||
            newItem.categoryImage         });
      }
    },

    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },

    setCart(state, action) {
      state.items = (action.payload);
    },
  },
});

export const selectCartItems = (state) => (state.cart?.items ?? []);

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;
