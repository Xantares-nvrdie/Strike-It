import axios from 'axios';

// 1. Konfigurasi Instance Axios
const api = axios.create({
    baseURL: 'http://localhost:3000', // Sesuaikan dengan port backend Fastify Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor Token (Otomatis menyisipkan Token JWT ke setiap request)
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

api.interceptors.response.use(
    (response) => {
        // Jika respon sukses (200, 201), loloskan saja
        return response;
    },
    (error) => {
        // Cek jika error dari backend adalah 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn('Sesi telah berakhir. Mengalihkan ke halaman login...');
            
            // 1. Hapus token yang sudah basi dari storage
            localStorage.removeItem('token');
            
            // 2. Paksa redirect ke halaman login
            // Kita gunakan window.location agar halaman ter-refresh bersih
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 3. Daftar API Call
export default {
    
    // --- AUTHENTICATION ---
    login(email, password) {
        return api.post('/login', { email, password });
    },
    register(data) {
        return api.post('/users', data); // Sesuaikan route register di backend
    },

    // --- USER PROFILE ---
    getMyProfile() {
        return api.get('/users/me');
    },
    updateProfile(data) {
        return api.put('/users/me', data);
    },

    // --- UPLOAD UTILITY ---
    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // --- MASTER DATA (PUBLIC) ---
    getProducts() {
        // Mengambil data produk/alat pancing
        return api.get('/products'); 
    },
    getEvents() {
        // Mengambil data event/lomba
        return api.get('/events');
    },
    getDiscounts() {
        // Mengambil data promo/diskon
        return api.get('/discounts');
    },
    getMemberships() {
        // Mengambil jenis membership
        return api.get('/memberships'); 
    },

    // --- LOCATIONS (PEMANCINGAN) ---
    getLocations() {
        // List semua lokasi
        return api.get('/locations');
    },
    getLocationDetail(id) {
        // Detail satu lokasi spesifik
        return api.get(`/locations/${id}`);
    },
    getLocationReviews(id) {
        // Review khusus untuk lokasi tertentu (Halaman Detail Lokasi)
        return api.get(`/locations/${id}/reviews`);
    },

    // --- REVIEWS (SYSTEM) ---
    getPublicReviews() {
        // Review umum/terbaru untuk ditampilkan di Landing Page
        return api.get('/reviews/location-public');
    },
    createReview(data) {
        // Submit review baru (Rating & Komentar)
        return api.post('/reviews', data);
    },

    // --- BOOKINGS (TRANSAKSI SEWA) ---
    createBooking(data) {
        // Membuat booking baru
        return api.post('/bookings', data);
    },
    getMyBookings() {
        // Mengambil riwayat booking user yang sedang login
        return api.get('/bookings/my-bookings');
    },
    getLocationSpots(id, date) {
        return api.get(`/locations/${id}/spots`, { params: { date } });
    },

    // --- COMMUNITY (FORUM) ---
    getAllPosts() {
        // Feed semua postingan
        return api.get('/community/posts');
    },
    getPostDetail(id) {
        // Detail satu postingan
        return api.get(`/community/posts/${id}`);
    },
    createPost(data) {
        // Membuat postingan baru
        return api.post('/community/posts', data);
    },
    toggleLikePost(postId) {
        // Like/Unlike postingan
        return api.post(`/community/posts/${postId}/like`);
    },
    
    // --- COMMENTS (KOMENTAR FORUM) ---
    getPostComments(postId) {
        return api.get(`/community/posts/${postId}/comments`);
    },
    createComment(postId, data) {
        return api.post(`/community/posts/${postId}/comments`, data);
    },
    toggleLikeComment(commentId) {
         // Like/Unlike komentar (Jika fitur ini diaktifkan nanti)
        return api.post(`/community/comments/${commentId}/like`);
    },

    // --- PAYMENTS (PEMBAYARAN) ---
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
