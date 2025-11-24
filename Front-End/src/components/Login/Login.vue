<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();

// State Form
const email = ref('');
const password = ref('');
const showPassword = ref(false); // <--- 1. State baru untuk toggle password
const isLoading = ref(false);
const errorMessage = ref('');

// --- 1. LOGIC LOGIN GOOGLE ---
const loginWithGoogle = () => {
  window.location.href = 'http://localhost:3000/auth/google';
};

// --- 2. TANGKAP TOKEN GOOGLE ---
onMounted(() => {
  const token = route.query.token;
  const userDataStr = route.query.user;
  const error = route.query.error;

  if (token && userDataStr) {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userDataStr);
      window.history.replaceState({}, document.title, '/login');
      router.push('/home');
    } catch (e) {
      console.error("Gagal memproses data login Google", e);
      errorMessage.value = "Terjadi kesalahan saat memproses login.";
    }
  } else if (error) {
    errorMessage.value = "Gagal login dengan Google. Silakan coba lagi.";
  }
});

// --- 3. LOGIC LOGIN MANUAL ---
const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await api.login(email.value, password.value);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    router.push('/home');

  } catch (error) {
    console.error('Login Error:', error);
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Gagal terhubung ke server.';
    }
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => router.push('/register');
const goToHome = () => router.push('/home');
</script>

<template>
  <div class="flex min-h-screen w-screen items-center justify-center bg-[#f5f5f5] px-4 font-['Outfit']">
    <div class="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl relative">

      <div class="hidden w-1/2 bg-blue-600 md:block relative">
        <img src="@/assets/mancing.png" alt="Login Illustration"
          class="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-multiply" />
        <div class="absolute bottom-0 left-0 p-12 text-white z-10">
          <h2 class="text-4xl font-bold mb-4">Strike It!</h2>
          <p class="text-blue-100 text-lg leading-relaxed">
            Temukan spot mancing terbaik dan nikmati pengalaman yang tak terlupakan.
          </p>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
      </div>

      <div class="w-full p-8 md:w-1/2 md:p-12 flex flex-col justify-center relative">

        <button @click="goToHome"
          class="absolute top-6 left-6 md:left-8 flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
          <Icon icon="mdi:arrow-left" class="w-5 h-5" />
          <span class="text-sm font-medium">Beranda</span>
        </button>

        <div class="mb-8 mt-8">
          <h2 class="mb-2 text-3xl font-bold text-gray-800">Selamat Datang Kembali</h2>
          <p class="text-gray-500">Masuk ke akun Strike It Anda</p>
        </div>

        <div v-if="errorMessage"
          class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <Icon icon="mdi:alert-circle" class="w-5 h-5" />
          {{ errorMessage }}
        </div>

        <button @click="loginWithGoogle"
          class="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-100 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 active:scale-95">
          <Icon icon="logos:google-icon" class="h-5 w-5" />
          Masuk dengan Google
        </button>

        <div class="relative mb-6 flex items-center justify-center">
          <span class="absolute bg-white px-2 text-xs text-gray-400 uppercase tracking-wider">atau dengan email</span>
          <div class="h-px w-full bg-gray-200"></div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <div class="relative">
              <input id="email" v-model="email" type="email" required placeholder="nama@email.com"
                class="w-full rounded-xl border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none transition-all" />
              <Icon icon="heroicons:envelope" class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required
                placeholder="••••••••"
                class="w-full rounded-xl border border-gray-300 p-3 pl-10 pr-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none transition-all" />

              <Icon icon="heroicons:lock-closed"
                class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                <Icon :icon="showPassword ? 'heroicons:eye' : 'heroicons:eye-slash'" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            <Icon v-if="isLoading" icon="eos-icons:loading" class="animate-spin" />
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-gray-600">
          Belum punya akun?
          <button @click="goToRegister" class="font-bold text-blue-600 hover:text-blue-500 hover:underline ml-1">
            Daftar Sekarang
          </button>
        </p>
      </div>

    </div>
  </div>
</template>