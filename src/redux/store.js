// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './authSlice';
import productReducer from './productSlice';
import cartReducer    from './cartSlice';
import orderReducer   from './orderSlice';

const store = configureStore({
  reducer: {
    auth:     authReducer,
    products: productReducer,
    cart:     cartReducer,
    orders:   orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['products/create', 'products/update'],
        ignoredActionPaths: ['payload', 'meta.arg', 'meta.arg.data'],
      },
    }),
});

export default store;
