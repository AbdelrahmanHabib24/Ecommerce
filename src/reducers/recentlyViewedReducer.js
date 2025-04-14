import { createSlice } from '@reduxjs/toolkit';
import { safeParse } from '../utils/safeParse';

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { items: safeParse('recentlyViewed') },
  reducers: {
    setRecentlyViewed(state, action) {
      state.items = action.payload;
      localStorage.setItem('recentlyViewed', JSON.stringify(state.items));
    },
  },
});

export const { setRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;