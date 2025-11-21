<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router"; // Import useRouter
import { Icon } from "@iconify/vue";

const router = useRouter(); // Inisialisasi router

// Definisikan item Beranda secara terpisah
const homeItem = ref({
    name: "Kembali ke Beranda",
    icon: "heroicons:home",
    path: "/home",
});

// Definisikan item navigasi utama (tanpa Beranda)
const mainNavigationItems = ref([
    { name: "Profil", icon: "heroicons:user-circle", path: "/profile" },
    { name: "Riwayat", icon: "heroicons:clock", path: "/history" },
    {
        name: "Komunitas",
        icon: "heroicons:chat-bubble-left-right",
        path: "/community",
    },
]);

// --- FUNGSI LOGOUT ---
const handleLogout = () => {
    // 1. Konfirmasi User (Opsional tapi disarankan)
    if (confirm("Apakah Anda yakin ingin keluar?")) {
        
        // 2. Hapus Token & Data User dari Penyimpanan Browser
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 3. Arahkan kembali ke halaman Login
        router.push("/login");
    }
};
</script>

<template>
    <aside
        class="h-full fixed p-4 md:p-6 flex flex-col bg-zinc-100 w-20 md:w-64 transition-all duration-300"
    >
        <div
        class="flex items-center gap-3 mb-10 px-2 justify-center md:justify-start"
        >
        <img
            src="../../assets/logo_hitam.png"
            alt="Logo"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <span
            class="text-2xl font-bold font-outfit text-stone-900 hidden md:block"
            >Strike It!</span
        >
        </div>

        <nav class="flex flex-col flex-1 justify-between">
        
        <!-- BAGIAN ATAS (Link Home & Menu Utama) -->
        <!-- Saya kembalikan struktur div-nya seperti awal -->
        
        <RouterLink
            :to="homeItem.path"
            class="flex items-center p-3.5 bg-white rounded-xl transition-all text-stone-700 hover:bg-blue-300 hover:text-zinc-100 group"
            active-class="bg-blue-500 !text-white hover:bg-blue-700"
        >
            <div class="flex items-center gap-3">
            <Icon
                :icon="homeItem.icon"
                class="w-6 h-6 md:w-5 md:h-5 flex-shrink-0"
            />
            <span
                class="font-medium font-outfit text-center text-lg hidden md:block"
                >{{ homeItem.name }}</span
            >
            <Icon
                icon="heroicons:chevron-right-20-solid"
                class="w-5 h-5 transition-transform group-hover:translate-x-0.5 hidden md:block"
            />
            </div>
        </RouterLink>

        <div class="flex flex-col space-y-3">
            <RouterLink
            v-for="item in mainNavigationItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center p-3.5 bg-white rounded-xl transition-all text-stone-700 hover:bg-blue-300 hover:text-zinc-100 group justify-center md:justify-between"
            active-class="bg-blue-500 !text-white hover:bg-blue-700"
            >
            <div class="flex items-center gap-3">
                <Icon
                :icon="item.icon"
                class="w-6 h-6 md:w-5 md:h-5 flex-shrink-0"
                />
                <span class="font-medium font-outfit text-lg hidden md:block">{{
                item.name
                }}</span>
            </div>
            <Icon
                icon="heroicons:chevron-right-20-solid"
                class="w-5 h-5 transition-transform group-hover:translate-x-0.5 hidden md:block"
            />
            </RouterLink>
        </div>

        <!-- TOMBOL LOGOUT -->
        <div class="mt-6">
            <button
            @click="handleLogout"
            class="flex items-center w-full p-3.5 bg-white rounded-xl transition-all text-stone-700 hover:bg-red-50 hover:text-red-700 group justify-center md:justify-between"
            >
            <div class="flex items-center gap-3">
                <Icon
                icon="heroicons:arrow-left-on-rectangle-20-solid"
                class="w-6 h-6 md:w-5 md:h-5 flex-shrink-0"
                />
                <span class="font-medium font-outfit text-lg hidden md:block"
                >Keluar</span
                >
            </div>
            <Icon
                icon="heroicons:chevron-right-20-solid"
                class="w-5 h-5 hidden md:block"
            />
            </button>
        </div>
        </nav>
    </aside>
</template>

<style scoped>
.router-link-active {
    color: white;
}
.router-link-active:hover {
    color: white;
}
</style>
