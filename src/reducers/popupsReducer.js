import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popups",
  initialState: {
    cartPopup: false,
    wishlistPopup: false,
  },
  reducers: {
    setCartPopup: (state, action) => {
      state.cartPopup = action.payload;
    },
    setWishlistPopup: (state, action) => {
      state.wishlistPopup = action.payload;
    },
  },
});

export const { setCartPopup, setWishlistPopup } = popupSlice.actions;

export default popupSlice.reducer;
