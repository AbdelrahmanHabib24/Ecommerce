// src/reducers/productsReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const PRODUCTS_PER_PAGE = 5;
const API_URL = "https://fakestoreapi.com/products";

const initialState = {
  products: [],
  allProducts: [],
  loading: false,
  error: null,
  currentPage: 1,
  productsPerPage: PRODUCTS_PER_PAGE,
  selectedProduct: null,
  productModalOpen: false,
  lastFetched: null,
  totalProducts: 0,
};

// Helper function: paginate products
const paginate = (all, page, perPage) => {
  const offset = (page - 1) * perPage;
  return all.slice(offset, offset + perPage);
};

// Thunk to fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ signal } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { products: data, total: data.length };
    } catch (error) {
      if (error.name === "AbortError") {
        return rejectWithValue("Fetch aborted");
      }
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    setProductModalOpen(state, action) {
      state.productModalOpen = action.payload;
    },
    setCurrentPage(state, action) {
      const page = Math.max(1, action.payload);
      state.currentPage = page;
      state.products = paginate(state.allProducts, page, state.productsPerPage);
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    resetProducts(state) {
      state.currentPage = 1;
      state.selectedProduct = null;
      state.productModalOpen = false;
      state.error = null;
      state.products = paginate(state.allProducts, 1, state.productsPerPage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, total } = action.payload;
        state.loading = false;

        const enhancedProducts = products.map((p) => {
          const price = p.price;
          const originalPrice = +(price * 1.2).toFixed(2);
          const discount = Math.round(
            ((originalPrice - price) / originalPrice) * 100
          );

          const rating = (Math.random() * (5 - 3) + 3).toFixed(1);

          const inStock = Math.random() > 0.3;

          return {
            ...p,
            price,
            originalPrice,
            discount,
            rating,
            inStock,
          };
        });

        state.allProducts = enhancedProducts;
        state.totalProducts = total;
        state.products = paginate(
          state.allProducts,
          state.currentPage,
          state.productsPerPage
        );
        state.lastFetched = Date.now();
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

// Export actions
export const {
  setSelectedProduct,
  setProductModalOpen,
  setCurrentPage,
  setError,
  clearError,
  resetProducts,
} = productsSlice.actions;

export default productsSlice.reducer;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectAllProducts = (state) => state.products.allProducts;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectTotalPages = (state) =>
  Math.ceil(state.products.totalProducts / state.products.productsPerPage);
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductModalOpen = (state) =>
  state.products.productModalOpen;
export const selectTotalProducts = (state) => state.products.totalProducts;
