import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
};

const updateLocalStorage = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      updateLocalStorage(state.items);
    },

    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        updateLocalStorage(state.items);
      }
    },

    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      updateLocalStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },

    // Add setCart reducer
    setCart(state, action) {
      state.items = action.payload;
      updateLocalStorage(state.items);
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;