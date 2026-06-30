import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi } from '../../api/productApi';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    console.log('📤 fetchCategories called');
    const response = await categoryApi.getCategories();
    console.log('📥 fetchCategories response:', response);
    return response;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('⏳ Categories loading...');
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        console.log('📦 Categories payload:', payload);
        
        if (payload && payload.success) {
          state.items = Array.isArray(payload.data) ? payload.data : [];
        } else if (payload && payload.data) {
          state.items = Array.isArray(payload.data) ? payload.data : [];
        } else {
          state.items = [];
        }
        console.log('✅ Categories loaded:', state.items.length);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('❌ Categories error:', state.error);
      });
  },
});

export default categorySlice.reducer;