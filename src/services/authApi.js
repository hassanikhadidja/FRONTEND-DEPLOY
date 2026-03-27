import api from './api';

// POST /user/login  →  { msg, token }
export const loginUser = async ({ email, password }) => {
  const res = await api.post('/user/login', { email, password });
  const { token } = res.data;

  // Store token first so the next request carries it
  localStorage.setItem('jt_token', token);

  // Fetch full user object using the token  →  GET /user/getcurrentuser
  const userRes = await api.get('/user/getcurrentuser');
  const user = userRes.data;

  return { token, user };
};

// POST /user/register  →  { msg: "Register success" }  (no token)
// After register we automatically log in so the user gets a session
export const registerUser = async ({ name, email, password }) => {
  await api.post('/user/register', { name, email, password });

  // Backend only returns msg on register — so log in straight away
  const loginRes = await api.post('/user/login', { email, password });
  const { token } = loginRes.data;

  localStorage.setItem('jt_token', token);

  const userRes = await api.get('/user/getcurrentuser');
  const user = userRes.data;

  return { token, user };
};
