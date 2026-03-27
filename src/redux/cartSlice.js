import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) { existing.quantity += 1; }
      else { state.items.push({ ...action.payload, quantity: 1 }); }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    updateQuantity(state, action) {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart(state) { state.items = []; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
