<script setup>
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const navigationItems = ref([
  { name: 'Beranda', icon: 'heroicons:home', path: '/' },
  { name: 'Lokasi', icon: 'heroicons:map-pin', path: '/#preview' },
  { name: 'Langganan', icon: 'heroicons:banknotes', path: '/#langganan' },
  { name: 'Diskon', icon: 'heroicons:tag', path: '/#diskon' },
  { name: 'Penilaian', icon: 'heroicons:chat-bubble-left-right', path: '/#penilaian' }
]);

const navigationItemsShop = ref([
  { name: 'Beranda', icon: 'heroicons:home', path: '/' },
  { name: 'Booking', icon: 'heroicons:bookmark', path: '/location' },
  { name: 'Alat', icon: 'heroicons:shopping-bag', path: '/shop' },
  { name: 'Event', icon: 'heroicons:calendar', path: '/event' }
]);

const route = useRoute();
const isMenuOpen = ref(false)

const navbarClass = computed(() => {
  if (route.meta.navbarStyle === 'transparent') {
    return 'sticky top-0 z-50 w-full h-16 bg-transparent text-white absolute';
  }


  return 'sticky top-0 z-50 w-full h-16 shadow-md bg-white text-gray-800';
});

const isMainPage = computed(() => route.name === 'Home');

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="absolute top-0 left-0 z-50 flex items-center justify-between w-full px-10 py-4 font-semibold text-white">
    <div class="logo">
      <img src="../../assets/strikeit_logo.png" alt="Logo Strike It" class="w-[50px] h-[50px] object-contain" />
    </div>

    <!-- Menu Desktop -->
    <ul v-if="isMainPage" class="hidden lg:flex list-none gap-x-[30px]">
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/">
          <button class="btn-glass group-hover:text-[#122f4f]">Beranda</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/#preview">
          <button class="btn-glass group-hover:text-[#122f4f]">Lokasi</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/#langganan">
          <button class="btn-glass group-hover:text-[#122f4f]">Langganan</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/#diskon">
          <button class="btn-glass group-hover:text-[#122f4f]">Diskon</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/#penilaian">
          <button class="btn-glass group-hover:text-[#122f4f]">Penilaian</button>
        </router-link>
      </li>
    </ul>

    <!-- Menu Desktop untuk Shop -->
    <ul v-else class="hidden lg:flex list-none gap-x-[30px]">
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">\
        <router-link to="/">
          <button class="btn-glass group-hover:text-[#122f4f]">Beranda</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/location">
          <button class="btn-glass group-hover:text-[#122f4f]">Booking</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/shop">
          <button class="btn-glass group-hover:text-[#122f4f]">Alat</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/event">
          <button class="btn-glass group-hover:text-[#122f4f]">Event</button>
        </router-link>
      </li>
    </ul>

    <!-- Profile -->
    <ul class="hidden lg:flex list-none items-center gap-x-2.5">
      <li>
        <img src="../../assets/saskeh.jpg" alt="Foto Profile" class="object-cover w-10 h-10 rounded-full" />
      </li>
      <li>
        <button class="btn-glass">Profile</button>
      </li>
    </ul>

    <!-- Tombol Hamburger (Mobile) -->
    <button @click="toggleMenu"
      class="lg:hidden flex flex-col justify-center items-center gap-[4px] w-10 h-10 rounded-md hover:bg-white/10 transition">
      <span class="w-6 h-[2px] bg-white transition-all" :class="{ 'rotate-45 translate-y-[6px]': isMenuOpen }"></span>
      <span class="w-6 h-[2px] bg-white" :class="{ 'opacity-0': isMenuOpen }"></span>
      <span class="w-6 h-[2px] bg-white transition-all" :class="{ '-rotate-45 -translate-y-[6px]': isMenuOpen }"></span>
    </button>

    <!-- Menu Mobile -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="absolute top-[70px] left-0 w-full flex justify-center lg:hidden">
        <!-- ====== CONTAINER ====== -->
        <div
          class="w-[85vw] bg-[#406691]/50 backdrop-blur-md rounded-2xl border-4 border-white/50 p-5 flex flex-col items-center gap-3 text-white">
          <!-- ===== PROFILE BOX ===== -->
          <div class="w-full bg-white/10 rounded-2xl border-4 border-white/50 flex flex-col items-center gap-2 py-4">
            <img src='../../assets/saskeh.jpg' alt="Foto Profile"
              class="object-cover w-[12dvh] h-[12dvh] rounded-full" />
            <p class="font-semibold text-lg">User</p>
            <span class="text-sm opacity-80">Lihat profil</span>
          </div>

          <!-- ===== NAVIGATION BOX ===== -->
          <div
            class="w-full bg-white/10 rounded-2xl border-4 border-white/50 flex flex-col items-start gap-4 px-6 py-5">
            <template v-if="isMainPage">
              <router-link @click="toggleMenu" v-for="item in navigationItems" :key="item.name" :to="item.path"
                class="btn-glass w-full flex items-center gap-3 justify-start">
                <Icon :icon="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </router-link>
            </template>

            <template v-else>
              <router-link @click="toggleMenu" v-for="item in navigationItemsShop" :key="item.name" :to="item.path"
                class="btn-glass w-full flex items-center gap-3 justify-start">
                <Icon :icon="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </router-link>
            </template>
          </div>

          <!-- ===== LOGOUT BOX ===== -->
          <div class="w-full">
            <button
              class="w-full bg-white/10 border-4 border-white/50 text-white rounded-2xl py-3 font-semibold hover:bg-white/20 transition">
              <i class="fas fa-sign-out-alt mr-2"></i> Keluar
            </button>
          </div>
        </div>
      </div>
    </transition>

  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
