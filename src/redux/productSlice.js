import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/productApi';

// Your backend returns { msg } not { message } — fix the error key
const getErr = (e) => e.response?.data?.msg || e.response?.data?.message || e.message || 'Failed';

export const fetchAllProducts = createAsyncThunk('products/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await api.getAllProducts(); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const fetchProductById = createAsyncThunk('products/fetchById',
  async (id, { rejectWithValue }) => {
    try { return await api.getProductById(id); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const createProduct = createAsyncThunk('products/create',
  async (formData, { rejectWithValue }) => {
    try { return await api.createProduct(formData); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const updateProduct = createAsyncThunk('products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Backend returns only { msg: "Update success" } — not the updated product.
      // So after updating, we fetch the product to keep Redux store in sync.
      await api.updateProduct(id, data);
      return await api.getProductById(id);
    } catch (e) {
      return rejectWithValue(getErr(e));
    }
  }
);

export const deleteProduct = createAsyncThunk('products/delete',
  async (id, { rejectWithValue }) => {
    try { await api.deleteProduct(id); return id; }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], currentProduct: null, loading: false, error: null },
  reducers: {
    clearCurrentProduct(state) { state.currentProduct = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(fetchAllProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload; })
      .addCase(fetchAllProducts.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchProductById.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.currentProduct = a.payload; })
      .addCase(fetchProductById.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createProduct.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(createProduct.fulfilled, (s) => { s.loading = false; })
      .addCase(createProduct.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateProduct.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.loading = false;
        // a.payload is now the full updated product fetched after update
        const idx = s.products.findIndex(p => p._id === a.payload._id);
        if (idx !== -1) s.products[idx] = a.payload;
        if (s.currentProduct?._id === a.payload._id) s.currentProduct = a.payload;
      })
      .addCase(updateProduct.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.products = s.products.filter(p => p._id !== a.payload);
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
