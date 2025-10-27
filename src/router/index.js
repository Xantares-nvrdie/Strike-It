import { createRouter, createWebHistory } from 'vue-router';
// 1. Impor "views" (halaman) Anda
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ShopView from '../views/ShopView.vue';
// 2. Tentukan "peta" Anda
const routes = [
  {
    path: '/', // Jika URL adalah '/' (halaman utama)
    name: 'Home',
    component: HomeView // Tampilkan komponen HomeView
  },
  {
    path: '/about', // Jika URL adalah '/about'
    name: 'About',
    component: AboutView // Tampilkan komponen AboutView
  },
  {
    path: '/Shop', // Jika URL adalah '/' (halaman utama)
    name: 'Shop',
    component: ShopView // Tampilkan komponen HomeView
  }
];

// 3. Buat routernya
const router = createRouter({
  history: createWebHistory(),
  routes, // Berikan "peta" yang tadi Anda buat
});

export default router;