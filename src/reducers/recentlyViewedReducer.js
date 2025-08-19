import { createSlice } from '@reduxjs/toolkit';

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { items: [] },
  reducers: {
    setRecentlyViewed(state, action) {
      state.items = action.payload;
    },
  },
});

export const { setRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
