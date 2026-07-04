import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bannerApi } from '../../api/productApi';

// ✅ Async thunk để fetch banners
export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerApi.getBanners();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Async thunk để tạo banner
export const createBanner = createAsyncThunk(
  'banners/createBanner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bannerApi.createBanner(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Async thunk để cập nhật banner
export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bannerApi.updateBanner(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Async thunk để xóa banner
export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await bannerApi.deleteBanner(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create banner
      .addCase(createBanner.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update banner
      .addCase(updateBanner.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete banner
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;
