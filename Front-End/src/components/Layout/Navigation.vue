<script setup>
import { useRoute, useRouter } from 'vue-router'; // Tambah useRouter
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter(); // Inisialisasi router

// --- STATE LOGIN ---
const isLoggedIn = ref(false);
const userName = ref('Guest');

// Cek status login saat komponen dimuat
onMounted(() => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  if (token && userString) {
    isLoggedIn.value = true;
    try {
      const user = JSON.parse(userString);
      userName.value = user.name || 'User';
    } catch (e) {
      userName.value = 'User';
    }
  } else {
    isLoggedIn.value = false;
  }
});

// --- DATA NAVIGASI ---
const navigationItems = ref([
  { name: 'Beranda', icon: 'heroicons:home', path: '/' },
  { name: 'Lokasi', icon: 'heroicons:map-pin', path: '/home/#preview' },
  { name: 'Langganan', icon: 'heroicons:banknotes', path: '/home/#langganan' },
  { name: 'Diskon', icon: 'heroicons:tag', path: '/home/#diskon' },
  { name: 'Penilaian', icon: 'heroicons:chat-bubble-left-right', path: '/home/#penilaian' }
]);

const navigationItemsShop = ref([
  { name: 'Beranda', icon: 'heroicons:home', path: '/home' },
  { name: 'Booking', icon: 'heroicons:bookmark', path: '/location' },
  { name: 'Alat', icon: 'heroicons:shopping-bag', path: '/shop' },
  { name: 'Acara', icon: 'heroicons:calendar', path: '/event' }
]);

const isMenuOpen = ref(false)
const isProfileOpen = ref(false)

const isMainPage = computed(() => route.name === 'Home');

// --- FUNGSI TOGGLE ---
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleProfileMenu = () => {
  isProfileOpen.value = !isProfileOpen.value
}

// --- FUNGSI LOGOUT ---
const handleLogout = () => {
  if(confirm("Yakin ingin keluar?")) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    isLoggedIn.value = false;
    isProfileOpen.value = false;
    router.push('/login');
  }
}
</script>

<template>
  <nav :class="[
    'z-50', 'flex', 'items-center', 'justify-between', 'w-full', 'px-10', 'py-4', 'font-semibold',
    {
      'absolute top-0 left-0 text-white': isMainPage,
      'top-0 bg-[#003bb3] left-0 relative text-white': !isMainPage
    }
  ]">
    
    <!-- LOGO -->
    <div class="logo cursor-pointer" @click="router.push('/home')">
      <img src="../../assets/strikeit_logo.png" alt="Logo Strike It" class="w-[50px] h-[50px] object-contain" />
    </div>

    <!-- MENU DESKTOP -->
    <ul v-if="isMainPage" class="hidden lg:flex list-none gap-x-[30px]">
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/home">
          <button class="btn-glass group-hover:text-[#122f4f]">Beranda</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/home/#preview">
          <button class="btn-glass group-hover:text-[#122f4f]">Lokasi</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/home/#langganan">
          <button class="btn-glass group-hover:text-[#122f4f]">Langganan</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/home/#diskon">
          <button class="btn-glass group-hover:text-[#122f4f]">Diskon</button>
        </router-link>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/home/#penilaian">
          <button class="btn-glass group-hover:text-[#122f4f]">Penilaian</button>
        </router-link>
      </li>
    </ul>

    <ul v-else class="hidden lg:flex list-none gap-x-[30px]">
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <router-link to="/home">
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

    <!-- USER AREA (DESKTOP) -->
    <div class="hidden lg:block w-48 relative">
      
      <!-- KONDISI 1: SUDAH LOGIN -->
      <div v-if="isLoggedIn" class="btn-glass text-white font-semibold">
        <button @click="toggleProfileMenu"
          class="flex items-center justify-center gap-2 w-full rounded-lg transition-colors">
          <img src="../../assets/user.png" alt="Foto Profile" class="object-cover w-9 h-9 rounded-full" />
          <span class="text-lg truncate max-w-[100px]">{{ userName }}</span>
        </button>

        <transition name="fade">
          <div v-if="isProfileOpen" class="absolute top-full right-0 mt-2 w-full btn-glass p-2 bg-[#406691]/90 backdrop-blur-md border border-white/20 rounded-xl">
            <div class="flex flex-col gap-1.5">
              <router-link to="/profile"
                class="w-full text-center px-3 py-2 rounded-[1.5rem] bg-black/15 hover:bg-white/20 transition-colors">
                Profile
              </router-link>
              <button
                @click="handleLogout"
                class="w-full text-center px-3 py-2 rounded-[1.5rem] bg-red-500/20 hover:bg-red-500/40 text-red-100 hover:text-white transition-colors">
                Log Out
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- KONDISI 2: BELUM LOGIN (GUEST) -->
      <div v-else class="flex gap-3 justify-end">
        <router-link to="/login">
          <button class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 transition-all text-white font-medium backdrop-blur-sm">
            Masuk
          </button>
        </router-link>
        <router-link to="/register">
          <button class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-900/20 transition-all">
            Daftar
          </button>
        </router-link>
      </div>

    </div>

    <!-- HAMBURGER MENU (MOBILE) -->
    <button @click="toggleMenu"
      class="lg:hidden flex flex-col justify-center items-center gap-[4px] w-10 h-10 rounded-md hover:bg-white/10 transition">
      <span class="w-6 h-[2px] bg-white transition-all" :class="{ 'rotate-45 translate-y-[6px]': isMenuOpen }"></span>
      <span class="w-6 h-[2px] bg-white" :class="{ 'opacity-0': isMenuOpen }"></span>
      <span class="w-6 h-[2px] bg-white transition-all" :class="{ '-rotate-45 -translate-y-[6px]': isMenuOpen }"></span>
    </button>

    <!-- MOBILE MENU DROPDOWN -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="absolute top-[70px] left-0 w-full flex justify-center lg:hidden px-4">
        <div
          class="w-full max-w-md bg-[#406691]/90 backdrop-blur-md rounded-[2rem] border border-white/20 p-5 flex flex-col items-center gap-3 text-white shadow-2xl">
          
          <!-- USER INFO MOBILE -->
          <div
            class="w-full bg-white/10 rounded-[1.5rem] border border-white/10 flex flex-col items-center gap-2 py-4">
            
            <template v-if="isLoggedIn">
                <img src='../../assets/user.png' alt="Foto Profile"
                class="object-cover w-[80px] h-[80px] rounded-full border-2 border-white/30" />
                <p class="font-semibold text-lg">{{ userName }}</p>
                <router-link to="/profile" class="text-sm opacity-80 hover:opacity-100 underline">
                Lihat Profil
                </router-link>
            </template>

            <template v-else>
                <div class="w-[80px] h-[80px] rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <Icon icon="heroicons:user" class="w-10 h-10 text-white/50" />
                </div>
                <p class="font-semibold text-lg">Tamu (Guest)</p>
                <div class="flex gap-3 mt-2">
                    <router-link to="/login" class="px-4 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30">Masuk</router-link>
                    <router-link to="/register" class="px-4 py-1.5 bg-blue-600 rounded-lg text-sm hover:bg-blue-700">Daftar</router-link>
                </div>
            </template>

          </div>

          <!-- NAVIGATION LINKS MOBILE -->
          <div
            class="w-full bg-white/10 rounded-[1.5rem] border border-white/10 flex flex-col items-start gap-3 px-5 py-5">
            <template v-if="isMainPage">
              <router-link @click="toggleMenu" v-for="item in navigationItems" :key="item.name" :to="item.path"
                class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition">
                <Icon :icon="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </router-link>
            </template>

            <template v-else>
              <router-link @click="toggleMenu" v-for="item in navigationItemsShop" :key="item.name" :to="item.path"
                class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition">
                <Icon :icon="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </router-link>
            </template>
          </div>

          <!-- LOGOUT BUTTON MOBILE (Hanya muncul jika login) -->
          <div v-if="isLoggedIn" class="w-full">
            <button
              @click="handleLogout"
              class="w-full bg-red-500/20 border border-red-500/30 text-red-100 rounded-[1.5rem] py-3 font-semibold hover:bg-red-500/40 transition flex items-center justify-center gap-2">
              <Icon icon="heroicons:arrow-left-on-rectangle" class="w-5 h-5" /> Keluar
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


</style>
