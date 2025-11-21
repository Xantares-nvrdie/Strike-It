// src/services/api.js
import axios from 'axios';

// 1. Buat Instance Axios (Settingan Pusat)
const api = axios.create({
    baseURL: 'http://localhost:3000', // Alamat Backend Fastify
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor (PENTING! Otomatis pasang Token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Daftar API Call
export default {

    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    
    // Auth
    login(email, password) {
        return api.post('/login', { email, password });
    },
    register(data) {
        return api.post('/users', data);
    },
    
    // Data Master
    getProducts() {
        return api.get('/api/products'); 
    },
    getLocations() {
        return api.get('/locations'); 
    },
    getLocationDetail(id) {
        return api.get(`/locations/${id}`);
    },
    // TAMBAHAN BARU: Ambil data membership
    getMemberships() {
        return api.get('/memberships');
    },

    // Transaksi
    createBooking(data) {
        return api.post('/bookings', data);
    },
    getMyBookings() {
        return api.get('/my-bookings');
    },

    // User Profile
    getMyProfile() {
        return api.get('/users/me');
    },
    updateProfile(data) {
        return api.put('/users/me', data); 
    },

    // Pembayaran & Membership
    payBooking(bookingId) {
        return api.post(`/pay/booking/${bookingId}`);
    },
    payOrder(orderId) {
        return api.post(`/pay/order/${orderId}`);
    },
    upgradeMembership(membershipId) {
        return api.post('/upgrade-membership', { id_membership: membershipId });
    }
};
