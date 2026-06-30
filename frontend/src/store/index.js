import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'products/fetchProducts/fulfilled',
          'categories/fetchCategories/fulfilled',
          'products/fetchProducts/rejected',
          'categories/fetchCategories/rejected',
        ],
        ignoredActionPaths: ['payload.headers'],
      },
    }),
  devTools: true,
});