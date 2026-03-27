import api from './api';

export const getAllProducts  = async () => (await api.get('/product')).data;
export const getProductById = async (id) => (await api.get(`/product/${id}`)).data;

export const createProduct = async (formData) => {
  const res = await api.post('/product', formData);
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await api.patch(`/product/${id}`, formData);
  return res.data;
};

export const deleteProduct = async (id) => (await api.delete(`/product/${id}`)).data;
