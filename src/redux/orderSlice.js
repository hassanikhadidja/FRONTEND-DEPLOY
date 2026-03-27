// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderApi from '../services/orderApi';

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try { return await orderApi.createOrder(orderData); }
    catch (e) { return rejectWithValue(e.response?.data?.msg || 'Failed to place order'); }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await orderApi.getAllOrders(); }
    catch (e) { return rejectWithValue(e.response?.data?.msg || 'Failed to load orders'); }
  }
);

const getErr = (e) =>
  e.response?.data?.msg || e.response?.data?.message || e.message || 'Failed';

/** Backend may return only `{ msg }` (no order). Thunk always returns data the reducer can apply. */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await orderApi.patchOrderStatus(id, status);
      const order = data?.order || data?.data;
      if (order && (order._id || order.id)) {
        return { mode: 'full', order: { ...order, _id: order._id || order.id } };
      }
      return { mode: 'patch', id, status };
    } catch (e) {
      return rejectWithValue(getErr(e));
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (e) {
      return rejectWithValue(getErr(e));
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:       [],
    loading:      false,
    placing:      false,
    error:        null,
    lastOrder:    null,
  },
  reducers: {
    clearLastOrder(state) { state.lastOrder = null; },
    clearError(state)     { state.error = null; },
    setLastOrder(state, action) {
      state.lastOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (s) => { s.placing = true;  s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => { s.placing = false; })
      .addCase(placeOrder.rejected,  (s, a) => { s.placing = false; s.error = a.payload; })

      .addCase(fetchAllOrders.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchAllOrders.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateOrderStatus.pending, (s) => { s.error = null; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const p = a.payload;
        if (p.mode === 'full' && p.order) {
          const idx = s.orders.findIndex(o => o._id === p.order._id);
          if (idx !== -1) s.orders[idx] = { ...s.orders[idx], ...p.order };
        } else if (p.mode === 'patch' && p.id) {
          const idx = s.orders.findIndex(o => o._id === p.id);
          if (idx !== -1) s.orders[idx] = { ...s.orders[idx], status: p.status };
        }
      })
      .addCase(updateOrderStatus.rejected, (s, a) => { s.error = a.payload; })

      .addCase(deleteOrder.fulfilled, (s, a) => {
        s.orders = s.orders.filter(o => o._id !== a.payload);
      })
      .addCase(deleteOrder.rejected, (s, a) => { s.error = a.payload; });
  },
});

export const { clearLastOrder, clearError, setLastOrder } = orderSlice.actions;
export default orderSlice.reducer;