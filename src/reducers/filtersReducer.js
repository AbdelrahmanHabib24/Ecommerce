import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  categoryFilter: "", 
  priceRange: [0, 1000],
  ratingFilter: 0,
  sortBy: "default",
  resetConfirmation: false,
};

const validatePriceRange = (range) => {
  const [min, max] = range;
  return [
    Math.max(0, Math.min(min, 1000)),
    Math.min(1000, Math.max(max, 0)),
  ];
};

const validateRatingFilter = (rating) => {
  return Math.max(0, Math.min(5, rating));
};

export const fetchFilterPresets = createAsyncThunk(
  'filters/fetchPresets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch filter presets');
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    setPriceRange(state, action) {
      state.priceRange = validatePriceRange(action.payload);
    },
    setRatingFilter(state, action) {
      state.ratingFilter = validateRatingFilter(action.payload);
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    resetFilters(state) {
      state.categoryFilter = initialState.categoryFilter;
      state.priceRange = initialState.priceRange;
      state.ratingFilter = initialState.ratingFilter;
      state.sortBy = initialState.sortBy;
      state.resetConfirmation = false;
    },
    setResetConfirmation(state, action) {
      state.resetConfirmation = action.payload;
    },
    applyFilterPreset(state, action) {
      const preset = action.payload;
      if (preset.categoryFilter) state.categoryFilter = preset.categoryFilter;
      if (preset.priceRange) state.priceRange = validatePriceRange(preset.priceRange);
      if (preset.ratingFilter !== undefined) state.ratingFilter = validateRatingFilter(preset.ratingFilter);
      if (preset.sortBy) state.sortBy = preset.sortBy;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterPresets.fulfilled, (state, action) => {
        const presets = action.payload;
        if (presets.budget) {
          state.priceRange = validatePriceRange(presets.budget.priceRange || initialState.priceRange);
          state.ratingFilter = validateRatingFilter(presets.budget.ratingFilter || initialState.ratingFilter);
        }
      })
      .addCase(fetchFilterPresets.rejected, (state, action) => {
        console.error('Failed to fetch filter presets:', action.payload);
      });
  },
});

export const {
  setCategoryFilter,
  setPriceRange,
  setRatingFilter,
  setSortBy,
  resetFilters,
  setResetConfirmation,
  applyFilterPreset,
} = filtersSlice.actions;

export default filtersSlice.reducer;

export const selectCategoryFilter = (state) => state.filters.categoryFilter;
export const selectPriceRange = (state) => state.filters.priceRange;
export const selectRatingFilter = (state) => state.filters.ratingFilter;
export const selectSortBy = (state) => state.filters.sortBy;
export const selectResetConfirmation = (state) => state.filters.resetConfirmation;



