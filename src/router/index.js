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
const routes = [
  {
    path: '/', // Jika URL adalah '/' (halaman utama)
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
    component: ShopView 
  },
  {
    path: '/details',
    name: 'Details',
    component: ProductView 
  },
  {
    path: '/shop/:categorySlug', 
    name: 'ShopCategory',
    component: ShopView
  },
  {
    path: '/location/place/book', 
    name: 'Book',
    component: BookingView
  },
  {
    path: '/location/place', 
    name: 'LocationDetail',
    component: LocationDetailView
  },
  {
    path: '/location', 
    name: 'Location',
    component: LocationView
  },
  {
    path: '/profile', 
    name: 'Profile',
    component: ProfileView,
    meta: { hideNavbar: true, hideFooter: true }
  },
  {
    path: '/history', 
    name: 'History',
    component: HistoryView,
    meta: { hideNavbar: true, hideFooter: true }
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
    component: CommunityView
  },
  {
    path: '/community/post/:id', 
    name: 'CommunityPost',
    component: PostDetailView
  },
  {
    path: '/community/create-post', 
    name: 'CommunityCreatePost',
    component: CreatePostView
  },
];

// 3. Buat routernya
const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    // 1. Cek apakah tujuannya adalah "hash link" (ada #)
    if (to.hash) {
      return {
        el: to.hash,        // 'el' menunjuk ke elemen dengan ID yg sama dgn hash
        behavior: 'smooth', // Buat scroll-nya jadi halus
      };
    }

    // 2. Jika kembali ke halaman sebelumnya (pakai tombol 'back' browser)
    if (savedPosition) {
      return savedPosition;
    }

    // 3. Jika pindah ke halaman baru (bukan hash link)
    return { 
      top: 0,               // Selalu scroll ke paling atas
      behavior: 'smooth' 
    };
  }
});

export default router;
