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
const isProfileOpen = ref(false) // State untuk expand/collapse profile

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

const toggleProfileMenu = () => { // Fungsi untuk toggle profile
  isProfileOpen.value = !isProfileOpen.value
}
</script>

<template>
  <nav :class="[
    // Kelas yang selalu ada
    'z-50', 'flex', 'items-center', 'justify-between', 'w-full', 'px-10', 'py-4', 'font-semibold',
    
    // Kelas kondisional
    {
      'absolute top-0 left-0 text-white': isMainPage,
      'top-0 bg-[#003bb3] left-0 relative text-white': !isMainPage // <-- Background biru jika bukan main page
    }
  ]">
    
    <div class="logo">
      <img src="../../assets/strikeit_logo.png" alt="Logo Strike It" class="w-[50px] h-[50px] object-contain" />
    </div>

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

    <ul v-else class="hidden lg:flex list-none gap-x-[30px]">
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
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

    <div class="hidden lg:block w-48 btn-glass text-white font-semibold relative">
      <button @click="toggleProfileMenu"
        class="flex items-center justify-center gap-2 w-full rounded-lg transition-colors">
        <img src="../../assets/user.png" alt="Foto Profile" class="object-cover w-9 h-9 rounded-full" />
        <span class="text-lg">salim</span>
      </button>

      <transition name="fade">
        <div v-if="isProfileOpen" class="absolute top-full right-0 mt-2 w-full btn-glass p-2">
          <div class="flex flex-col gap-1.5">
            <router-link to="/profile"
              class="w-full text-center px-3 py-2 rounded-[1.5rem] bg-black/15 hover:bg-white/20 transition-colors">
              Profile
            </router-link>
            <button
              class="w-full text-center px-3 py-2 rounded-[1.5rem] bg-black/15 hover:bg-white/20 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </transition>
    </div>

    <button @click="toggleMenu"
      class="lg:hidden flex flex-col justify-center items-center gap-[4px] w-10 h-10 rounded-md hover:bg-white/10 transition">
      <span class="w-6 h-[2px] bg-white transition-all" :class="{ 'rotate-45 translate-y-[6px]': isMenuOpen }"></span>
      <span class="w-6 h-[2px] bg-white" :class="{ 'opacity-0': isMenuOpen }"></span>
      <span class="w-6 h-[2px] bg-white transition-all" :class="{ '-rotate-45 -translate-y-[6px]': isMenuOpen }"></span>
    </button>

    <transition name="fade">
      <div v-if="isMenuOpen" class="absolute top-[70px] left-0 w-full flex justify-center lg:hidden">
        <div
          class="w-[85vw] bg-[#406691]/50 backdrop-blur-md rounded-[3rem] border-4 border-white/50 p-5 flex flex-col items-center gap-3 text-white">
          
          <div
            class="w-full bg-white/10 rounded-[1.5rem] border-4 border-white/50 flex flex-col items-center gap-2 py-4">
            <img src='../../assets/user.png' alt="Foto Profile"
              class="object-cover w-[12dvh] h-[12dvh] rounded-full" />
            <p class="font-semibold text-lg">User</p>
            <router-link to="/profile" class="btn-glass w-[] text-center flex items-center gap-3 justify-start">
              <span class="text-sm opacity-80 text-decoration-line">Lihat profil</span>
            </router-link>
          </div>

          <div
            class="w-full bg-white/10 rounded-[1.5rem] border-4 border-white/50 flex flex-col items-start gap-4 px-6 py-5">
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

          <div class="w-full">
            <button
              class="w-full bg-white/10 border-4 border-white/50 text-white rounded-[1.5rem] py-3 font-semibold hover:bg-white/20 transition">
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
