import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ShopView from '../views/ShopView.vue';
import ProductView from '@/views/ProductView.vue';
import LocationView from '@/views/LocationView.vue';
import LocationDetailView from '@/views/LocationDetailView.vue';
import BookingView from '@/views/BookingView.vue';
import ProfileView from '@/views/ProfileView.vue';
import HistoryView from '@/views/HistoryView.vue';
import CommunityView from '@/views/CommunityView.vue';
import PostDetailView from '@/views/PostDetailView.vue';
import CreatePostView from '@/views/CreatePostView.vue';
import EventView from '@/views/EventView.vue';
import CheckoutView from '@/views/CheckoutView.vue';   
import LoginView from '@/components/Login/Login.vue';
import RegisterView from '@/components/Login/Register.vue';
import IndexView from '@/views/IndexView.vue';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: IndexView,
    meta: { hideFooter: true, hideNavbar: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView 
  },
  {
    path: '/about', 
    name: 'About',
    component: AboutView 
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopView,
    meta: { hideFooter: true }
  },
  {
    path: '/shop/checkout',
    name: 'Checkout',
    component: CheckoutView,
    meta: { hideFooter: true, requiresAuth: true } 
  },
  {
    // UPDATE: Tambah :id agar bisa fetch detail produk (misal /product/1)
    path: '/product/:id', 
    name: 'Details',
    component: ProductView,
    meta: { hideFooter: true },
    props: true 
  },
  {
    path: '/shop/category/:categorySlug', // UPDATE: Biar lebih rapi strukturnya
    name: 'ShopCategory',
    component: ShopView,
    meta: { hideFooter: true }
  },
  {
    // UPDATE: Booking butuh ID lokasi & Login
    path: '/location/:id/book', 
    name: 'Book',
    component: BookingView,
    meta: { hideFooter: true, requiresAuth: true },
    props: true
  },
  {
    // UPDATE: Tambah :id untuk detail lokasi
    path: '/location/:id', 
    name: 'LocationDetail',
    component: LocationDetailView,
    meta: { hideFooter: true },
    props: true
  },
  {
    path: '/location', 
    name: 'Location',
    component: LocationView,
    meta: { hideFooter: true }
  },
  {
    path: '/profile', 
    name: 'Profile',
    component: ProfileView,
    // TAMBAHAN: Profile wajib login
    meta: { hideNavbar: true, hideFooter: true, requiresAuth: true }
  },
  {
    path: '/history', 
    name: 'History',
    component: HistoryView,
    // TAMBAHAN: History wajib login
    meta: { hideNavbar: true, hideFooter: true, requiresAuth: true }
  },
  {
    path: '/event', 
    name: 'Event',
    component: EventView,
    meta: { hideNavbar: true, hideFooter: true }
  },
  {
    path: '/community', 
    name: 'Community',
    component: CommunityView,
    meta: { hideNavbar: true, hideFooter: true }
  },
  {
    path: '/community/post/:id', 
    name: 'CommunityPost',
    component: PostDetailView,
    meta: { hideNavbar: true, hideFooter: true }
  },
  {
    path: '/community/create-post', 
    name: 'CommunityCreatePost',
    component: CreatePostView,
    // TAMBAHAN: Buat post wajib login
    meta: { hideNavbar: true, hideFooter: true, requiresAuth: true }
  },
  {
    path: '/login', 
    name: 'Login',
    component: LoginView,
    meta: { hideNavbar: true, hideFooter: true, guestOnly: true } // guestOnly: user login gaboleh kesini
  },
  {
    path: '/register', 
    name: 'Register',
    component: RegisterView,
    meta: { hideNavbar: true, hideFooter: true, guestOnly: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,        
        behavior: 'smooth', 
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { 
      top: 0,                
      behavior: 'smooth' 
    };
  }
});

// --- NAVIGATION GUARDS (PENTING) ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; // True jika ada token

  // 1. Jika halaman butuh login (requiresAuth) tapi user belum login
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' }); // Tendang ke Login
  } 
  // 2. Jika halaman khusus tamu (Login/Register) tapi user SUDAH login
  else if (to.matched.some(record => record.meta.guestOnly) && isAuthenticated) {
    next({ name: 'Home' }); // Tendang ke Home
  } 
  // 3. Lanjut normal
  else {
    next();
  }
});

export default router;
