import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STATIC_IMAGES = ["/electronics.avif", "/jewelry.jpg", "/clothes.avif"];

const initialState = {
  categories: [],
  formattedCategories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/categories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
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

function formatCategories(categories) {
  return categories.slice(0, 3).map((cat, i) => ({
    ...cat,
    img: STATIC_IMAGES[i],
    name: ["men's clothing", "women's clothing"].includes(cat.name)
      ? "Clothes"
      : cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase(),
    aosDelay: String(i * 200),
  }));
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
      state.formattedCategories = formatCategories(action.payload);
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
        state.formattedCategories = formatCategories(action.payload); 
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
