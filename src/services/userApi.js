import api from './api';
// GET /user  — Auth + isAdmin  → all users
export const getAllUsers = async () => (await api.get('/user')).data;
