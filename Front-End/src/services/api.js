import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

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
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Sesi berakhir. Redirect ke login...');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default {
    
    // --- AUTHENTICATION ---
    login(email, password) {
        return api.post('/login', { email, password });
    },
    register(data) {
        return api.post('/users', data);
    },

    // --- USER PROFILE ---
    getMyProfile() {
        return api.get('/users/me');
    },
    updateProfile(data) {
        return api.put('/users/me', data);
    },

    // --- UPLOAD ---
    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // --- PRODUCTS (SHOP) ---
    getProducts(params) {
        return api.get('/products', { params });
    },
    getProductDetail(id) { // Cukup didefinisikan sekali disini
        return api.get(`/products/${id}`);
    },
    getProductReviews(id) {
        return api.get(`/products/${id}/reviews`);
    },
    createProductReview(id, data) {
        return api.post(`/products/${id}/reviews`, data);
    },

    // --- MASTER DATA ---
    getEvents() {
        return api.get('/events');
    },
    getDiscounts() {
        return api.get('/discounts');
    },
    getMemberships() {
        return api.get('/memberships'); 
    },

    // --- LOCATIONS (BOOKING) ---
    getLocations() {
        return api.get('/locations');
    },
    getLocationDetail(id) {
        return api.get(`/locations/${id}`);
    },
    getLocationReviews(id) {
        return api.get(`/locations/${id}/reviews`);
    },
    getLocationSpots(id, date) {
        return api.get(`/locations/${id}/spots`, { params: { date } });
    },
    checkVoucher(code) {
        return api.post('/discounts/check', { code }); 
    },
    createBooking(data) {
        return api.post('/bookings', data);
    },
    getMyBookings() {
        return api.get('/bookings/my-bookings');
    },

    // --- CART & ORDERS ---
    getCart() {
        return api.get('/cart');
    },
    addToCart(data) {
        return api.post('/cart', data);
    },
    removeFromCart(cartId) {
        return api.delete(`/cart/${cartId}`);
    },
    createOrder(data) {
        return api.post('/orders', data);
    },
    getMyOrders() {
        return api.get('/orders/my-orders');
    },

    // --- REVIEWS (Landing Page) ---
    getPublicReviews() {
        return api.get('/reviews/location-public');
    },
    createReview(data) {
        return api.post('/reviews', data);
    },

    // --- COMMUNITY ---
    getAllPosts() {
        return api.get('/community/posts');
    },
    getPostDetail(id) {
        return api.get(`/community/posts/${id}`);
    },
    createPost(data) {
        return api.post('/community/posts', data);
    },
    toggleLikePost(postId) {
        return api.post(`/community/posts/${postId}/like`);
    },
    getPostComments(postId) {
        return api.get(`/community/posts/${postId}/comments`);
    },
    createComment(postId, data) {
        return api.post(`/community/posts/${postId}/comments`, data);
    },
    toggleLikeComment(commentId) {
        return api.post(`/community/comments/${commentId}/like`);
    },

    // --- PAYMENTS ---
    payBooking(bookingId) {
        return api.post(`/pay/booking/${bookingId}`);
    },
    payOrder(orderId) {
        return api.post(`/pay/order/${orderId}`);
    },
    upgradeMembership(membershipId) {
        return api.post('/upgrade-membership', { id_membership: membershipId });
    },
    getPaymentMethods() {
        return api.get('/payments-methods'); // Ini akan memanggil route yang baru kita buat di backend
    },
    updatePaymentMethod(id_payment_method) {
        // Kita gunakan endpoint update profile yang sudah ada, tapi kirim data spesifik
        return api.put('/users/me', { id_payment_method });
    },
};
