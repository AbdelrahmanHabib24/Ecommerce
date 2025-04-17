import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  categories: [], 
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ limit = 3 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/categories?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();

      return data.map((category, index) => ({
        id: index + 1,
        name: category,
        value: category,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;