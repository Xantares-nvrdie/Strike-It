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
// Setiap kali request dikirim, kode ini akan mengecek apakah ada token di localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Ambil token dari memori browser
        if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Tempel ke Header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Daftar API Call (Biar rapi)
export default {

    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        // Header 'Content-Type': 'multipart/form-data' biasanya otomatis dihandle axios
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
    
    // Products & Locations
    getProducts() {
        return api.get('/api/products'); // Sesuaikan prefix route di backend (kalo ada /api)
    },
    getLocations() {
        return api.get('/locations'); // Tadi di backend rutenya /locations
    },
    getLocationDetail(id) {
        return api.get(`/locations/${id}`);
    },

    // Transaksi (Butuh Token - otomatis dihandle interceptor di atas)
    createBooking(data) {
        return api.post('/bookings', data);
    },
    getMyBookings() {
        return api.get('/my-bookings');
    },

    // --- USER PROFILE ---
    getMyProfile() {
        return api.get('/users/me');
    },
    updateProfile(data) {
        return api.put('/users/me', data); // data isi: {name, bio, avatar_img}
    },

    // --- PEMBAYARAN & MEMBERSHIP ---
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
