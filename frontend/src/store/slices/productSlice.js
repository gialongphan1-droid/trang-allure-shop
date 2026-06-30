import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params) => {
    console.log('📤 fetchProducts called with params:', params);
    const response = await productApi.getProducts(params);
    console.log('📥 fetchProducts response:', response);
    return response;
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug) => {
    const response = await productApi.getProductBySlug(slug);
    return response;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    },
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      sort: '-createdAt',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        brand: '',
        sort: '-createdAt',
      };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Products loading...');
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Cấu trúc dữ liệu từ API: {success: true, data: [...], pagination: {...}}
        const payload = action.payload;
        console.log('📦 Products payload:', payload);
        
        if (payload && payload.success) {
          state.items = Array.isArray(payload.data) ? payload.data : [];
          state.pagination = payload.pagination || {
            total: 0,
            page: 1,
            limit: 12,
            totalPages: 0,
          };
        } else if (payload && payload.data) {
          // Fallback nếu không có success field
          state.items = Array.isArray(payload.data) ? payload.data : [];
        } else {
          state.items = [];
        }
        console.log('✅ Products loaded:', state.items.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('❌ Products error:', state.error);
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && payload.success) {
          state.currentProduct = payload.data || null;
        } else if (payload && payload.data) {
          state.currentProduct = payload.data || null;
        } else {
          state.currentProduct = null;
        }
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;