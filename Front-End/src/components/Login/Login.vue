<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

// Menggunakan router untuk navigasi
const router = useRouter();

// Data reaktif untuk form
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false); // Untuk status loading tombol
const errorMessage = ref(''); // Untuk menampilkan pesan error

// Fungsi untuk submit login
const handleLogin = async () => {

  errorMessage.value = '';
  isLoading.value = true;

  console.log('Login attempt:', {
    email: email.value,
    password: password.value,
    remember: rememberMe.value,
  });

  try {
    // 1. Panggil API Login ke Backend Fastify
    const response = await api.login(email.value, password.value);

    // 2. Ambil data dari response
    const { token, user } = response.data;

    // 3. Simpan Token & User ke LocalStorage (Browser)
    // Ini PENTING agar user tetap login saat refresh halaman
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // 4. Redirect ke halaman Home
    // alert(`Login Berhasil! Selamat datang ${user.name}`); // Opsional
    router.push('/home'); 

  } catch (error) {
    // 5. Tangkap Error dari Backend (Misal: Password salah)
    console.error('Login Error:', error);
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message; // Pesan dari backend
    } else {
      errorMessage.value = 'Terjadi kesalahan pada server.';
    }
  } finally {
    // Matikan status loading
    isLoading.value = false;
  }
};

// Fungsi untuk navigasi ke halaman register
const goToRegister = () => {
  router.push('/register'); // Ganti '/register' dengan path Anda
};
</script>

<template>
  <div class="flex min-h-screen w-screen items-center justify-center bg-zinc-100 p-4">
    <div class="w-full max-w-md">
      
      <div class="mb-4 text-center">
        <router-link 
          to="/home" 
          class="inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
        >
          <Icon icon="heroicons:arrow-left-20-solid" class="mr-1 h-5 w-5" />
          Kembali ke Beranda
        </router-link>
      </div>
      <div class="bg-white rounded-3xl shadow-xl p-8 md:p-10">
        
        <div class="text-center">
          <h1 class="text-3xl font-medium text-[#1e2f42] md:text-4xl">
            Selamat Datang!
          </h1>
          <p class="mt-2 text-gray-600">
            Masuk untuk melanjutkan ke Strike It!
          </p>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="relative mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                placeholder="email@anda.com"
                class="w-full rounded-xl border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Icon
                icon="heroicons:envelope"
                class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="relative mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                placeholder="Password Anda"
                class="w-full rounded-xl border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Icon
                icon="heroicons:lock-closed"
                class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="remember-me" class="ml-2 block text-gray-700">
                Ingat saya
              </label>
            </div>

            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              Lupa password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              class="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
            >
              Masuk
            </button>
          </div>
        </form>
        
        <p class="mt-8 text-center text-sm text-gray-600">
          Belum punya akun?
          <button
            @click="goToRegister"
            class="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Daftar di sini
          </button>
        </p>
      </div>

    </div>
  </div>
</template>
