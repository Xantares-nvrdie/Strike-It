import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ShopView from '../views/ShopView.vue';
import ProductView from '@/views/ProductView.vue';
import LocationView from '@/views/LocationView.vue';

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
    path: '/Shop',
    name: 'Shop',
    component: ShopView 
  },
  {
    path: '/Details',
    name: 'Details',
    component: ProductView 
  },
  {
    path: '/Location',
    name: 'Location',
    component: LocationView
  }
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
