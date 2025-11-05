<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';

// Definisikan item navigasi
const navigationItems = ref([
    { name: 'Profil', icon: 'heroicons:user-circle', path: '/Profile' },
    { name: 'Riwayat', icon: 'heroicons:clock', path: '/Riwayat' },
    { name: 'Komunitas', icon: 'heroicons:chat-bubble-left-right', path: '/Komunitas' },
]);

// Item 'Keluar' diperlakukan terpisah karena mungkin memiliki logic @click
// bukan <RouterLink>
</script>

<template>
    <aside class="w-64 h-screen p-6 flex flex-col bg-zinc-100 shadow-lg">
        
        <!-- Bagian Logo -->
        <div class="flex items-center gap-3 mb-10 px-2">
        <img src="https://placehold.co/40x40/003BB3/FFFFFF?text=SI" alt="Logo" class="w-10 h-10 rounded-full object-cover">
        <span class="text-2xl font-bold font-outfit text-stone-900">Strike It!</span>
        </div>

        <!-- Navigasi Utama -->
        <nav class="flex flex-col flex-1 space-y-3">
        <RouterLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center justify-between p-3.5 bg-white rounded-xl shadow-sm transition-all text-stone-700 hover:bg-blue-50 hover:text-blue-700 group"
            active-class="bg-blue-800 !text-white hover:bg-blue-700"
        >
            <div class="flex items-center gap-3">
                <Icon :icon="item.icon" class="w-5 h-5" />
                <span class="font-medium font-outfit text-lg">{{ item.name }}</span>
            </div>
            <Icon icon="heroicons:chevron-right-20-solid" class="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </RouterLink>
        </nav>

        <!-- Bagian Bawah (Keluar) -->
        <div>
        <button
            @click="handleLogout"
            class="flex items-center justify-between w-full p-3.5 bg-white rounded-xl shadow-sm transition-all text-stone-700 hover:bg-red-50 hover:text-red-700 group"
        >
            <div class="flex items-center gap-3">
            <Icon icon="heroicons:arrow-left-on-rectangle-20-solid" class="w-5 h-5" />
            <span class="font-medium font-outfit text-lg">Keluar</span>
            </div>
            <Icon icon="heroicons:chevron-right-20-solid" class="w-5 h-5" />
        </button>
        </div>
    </aside>
</template>

<style scoped>
/* Menambahkan style khusus untuk active-class agar ikon juga berubah warna */
.router-link-active {
    color: white;
}
.router-link-active:hover {
    color: white;
}
</style>
