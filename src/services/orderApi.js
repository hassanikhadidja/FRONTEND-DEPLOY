// src/services/orderApi.js
import api from './api';

export const createOrder   = async (data) => (await api.post('/order', data)).data;
export const getAllOrders   = async ()     => (await api.get('/order')).data;
/** Same resource as DELETE /order/:id — backend may not expose /order/:id/status */
export const patchOrderStatus = async (id, status) =>
  (await api.patch(`/order/${id}`, { status })).data;


export const deleteOrder = async (id) =>
  (await api.delete(`/order/${id}`)).data;