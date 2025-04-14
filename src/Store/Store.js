// src/Store/Store.js
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // ✅ هنا

import cartReducer from '../reducers/cartReducer';
import wishlistReducer from '../reducers/wishlistReducer';
import productsReducer from '../reducers/productsReducer';
import filtersReducer from '../reducers/filtersReducer';
import recentlyViewedReducer from '../reducers/recentlyViewedReducer';
import popupsReducer from '../reducers/popupsReducer';
import categoriesReducer from '../reducers/categoriesReducer';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    filters: filtersReducer,
    recentlyViewed: recentlyViewedReducer,
    popups: popupsReducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // ✅
});


export * from '../reducers/cartReducer';
export * from '../reducers/wishlistReducer';
export * from '../reducers/productsReducer';
export * from '../reducers/filtersReducer';
export * from '../reducers/recentlyViewedReducer';
export * from '../reducers/popupsReducer';
export * from '../reducers/categoriesReducer';