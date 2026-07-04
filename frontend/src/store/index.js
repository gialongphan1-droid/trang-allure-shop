import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import bannerReducer from './slices/bannerSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    banners: bannerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
