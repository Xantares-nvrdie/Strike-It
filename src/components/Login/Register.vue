<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

// Menggunakan router untuk navigasi
const router = useRouter();

// Data reaktif untuk form
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Fungsi untuk submit register
const handleRegister = () => {
  // Validasi password sederhana
    if (password.value !== confirmPassword.value) {
        alert('Password dan Konfirmasi Password tidak cocok!');
        return;
    }

    // --- LOGIKA REGISTER ANDA DI SINI ---
    // (Contoh: panggil API, buat user baru, dll.)

    console.log('Register attempt:', {
        name: name.value,
        email: email.value,
        password: password.value,
    });

  // Jika sukses, arahkan ke halaman login
    alert('Registrasi Berhasil! Silakan login.');
  router.push('/login'); // Ganti '/login' dengan path Anda
};

// Fungsi untuk navigasi ke halaman login
const goToLogin = () => {
  router.push('/login'); // Ganti '/login' dengan path Anda
};
</script>

<template>
    <div class="flex min-h-screen w-screen items-center justify-center bg-zinc-100 p-4">
        <div class="w-full max-w-md">
        
        <div class="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            
            <div class="text-center">
            <h1 class="text-3xl font-medium text-[#1e2f42] md:text-4xl">
                Buat Akun Baru
            </h1>
            <p class="mt-2 text-gray-600">
                Daftar untuk mulai memancing!
            </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
            
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                Nama Lengkap
                </label>
                <div class="relative mt-1">
                <input
                    id="name"
                    v-model="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    class="w-full rounded-xl border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Icon
                    icon="heroicons:user"
                    class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />
                </div>
            </div>

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
                    placeholder="Buat Password"
                    class="w-full rounded-xl border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Icon
                    icon="heroicons:lock-closed"
                    class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />
                </div>
            </div>

            <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                Konfirmasi Password
                </label>
                <div class="relative mt-1">
                <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    name="confirm-password"
                    type="password"
                    required
                    placeholder="Ulangi Password"
                    class="w-full rounded-xl border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <Icon
                    icon="heroicons:lock-closed"
                    class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                class="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
                >
                Daftar
                </button>
            </div>
            </form>
            
            <p class="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?
            <button
                @click="goToLogin"
                class="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
                Masuk di sini
            </button>
            </p>
        </div>

        </div>
    </div>
</template>
