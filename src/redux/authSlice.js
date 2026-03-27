import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../services/authApi';

// ── Thunks ──────────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // returns { token, user }  (assembled in authApi.js)
      const data = await loginUser(credentials);
      localStorage.setItem('jt_token', data.token);
      localStorage.setItem('jt_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      // Surface the backend msg field if present
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        'Login failed. Check your credentials.';
      return rejectWithValue(msg);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // returns { token, user }  (register then auto-login in authApi.js)
      const data = await registerUser(userData);
      localStorage.setItem('jt_token', data.token);
      localStorage.setItem('jt_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        'Registration failed.';
      return rejectWithValue(msg);
    }
  }
);

// ── Rehydrate from localStorage on page reload ───────────────────
const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('jt_user')); }
  catch { return null; }
})();

// ── Slice ────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: localStorage.getItem('jt_token') || null,
    isAuthenticated: !!localStorage.getItem('jt_token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('jt_token');
      localStorage.removeItem('jt_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      // Register
      .addCase(register.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(register.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
