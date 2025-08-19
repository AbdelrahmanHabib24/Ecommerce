// src/Store/Store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

// Reducers
import cartReducer from '../reducers/cartReducer';
import wishlistReducer from '../reducers/wishlistReducer';
import productsReducer from '../reducers/productsReducer';
import filtersReducer from '../reducers/filtersReducer';
import recentlyViewedReducer from '../reducers/recentlyViewedReducer';
import popupsReducer from '../reducers/popupsReducer';
import categoriesReducer from '../reducers/categoriesReducer';

// Combine reducers
export const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productsReducer,
  filters: filtersReducer, 
  recentlyViewed: recentlyViewedReducer,
  popups: popupsReducer,
  categories: categoriesReducer,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['products'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
