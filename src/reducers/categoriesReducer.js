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
      const res = await fetch("https://fakestoreapi.com/products/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();

      return data.map((name, index) => ({ id: index + 1, name, value: name }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const formatCategories = (categories) =>
  categories.slice(0, 3).map((cat, i) => ({
    ...cat,
    img: STATIC_IMAGES[i],
    name: ["men's clothing", "women's clothing"].includes(cat.name)
      ? "Clothes"
      : cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase(),
    aosDelay: String(i * 200),
  }));

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, { payload }) => {
      state.categories = payload;
      state.formattedCategories = formatCategories(payload);
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
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.categories = payload;
        state.formattedCategories = formatCategories(payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to fetch categories";
      });
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
