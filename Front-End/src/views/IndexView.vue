<script setup>
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const routes = ref([
  {
    path: "/home",
    name: "Beranda",
    desc: "Halaman utama (Landing Page).",
    icon: "heroicons:home-solid",
  },
  {
    path: "/login",
    name: "Login",
    desc: "Halaman untuk masuk.",
    icon: "heroicons:arrow-right-on-rectangle",
  },
  {
    path: "/register",
    name: "Register",
    desc: "Halaman untuk daftar akun baru.",
    icon: "heroicons:user-plus",
  },
  {
    path: "/profile",
    name: "Profil Pengguna",
    desc: "Halaman profil dan langganan.",
    icon: "heroicons:user-circle",
  },
  {
    path: "/history",
    name: "Riwayat Pesanan",
    desc: "Halaman riwayat & filter.",
    icon: "heroicons:list-bullet",
  },
  {
    path: "/community",
    name: "Komunitas",
    desc: "Halaman forum komunitas.",
    icon: "heroicons:chat-bubble-left-right",
  },
  {
    path: "/shop",
    name: "Toko (Utama)",
    desc: "Tampilan utama toko (/shop).",
    icon: "heroicons:shopping-bag",
  },
  {
    path: "/shop/joran",
    name: "Toko (Kategori)",
    desc: "Tampilan grid kategori (contoh: /shop/joran).",
    icon: "heroicons:tag",
  },
  {
    path: "/details",
    name: "Detail Produk",
    desc: "Halaman detail untuk satu produk.",
    icon: "heroicons:archive-box",
  },
  {
    path: "/shop/checkout",
    name: "Checkout",
    desc: "Halaman checkout barang.",
    icon: "heroicons:banknotes",
  },
  {
    path: "/event",
    name: "Acara",
    desc: "Acara/lomba strike-it.",
    icon: "heroicons:fire",
  },
  {
    path: "/location",
    name: "Daftar Lokasi Book",
    desc: "Menampilkan daftar lokasi.",
    icon: "heroicons:map-pin",
  },
  {
    path: "/location/place",
    name: "Preview Lokasi Book",
    desc: "Menampilkan preview lokasi.",
    icon: "heroicons:map",
  },
  {
    path: "/location/place/book",
    name: "Booking 3 langkah",
    desc: "Booking lokasi.",
    icon: "heroicons:calendar-days",
  },
]);
</script>

<template>
  <div class="w-screen min-h-screen bg-zinc-100 p-4 py-16 md:py-24 font-outfit">
    <div class="w-full max-w-md mx-auto">
      <!-- Header: Avatar & Judul -->
      <div class="flex flex-col items-center text-center">
        <img
          src="../assets/user.png"
          alt="Avatar"
          class="w-24 h-24 rounded-full shadow-xl border-4 border-white"
        />
        <h1 class="text-2xl font-semibold text-[#1e2f42] mt-4">
          Halaman Pengecekan Rute
        </h1>
        <p class="text-gray-600 mt-1">Dashboard Navigasi Cepat @StrikeIt_Dev</p>
        <ul class="mt-4 text-gray-700 text-center space-y-1">
          <h2>Anggota Kelompok 3</h2>
          <li>Bintang Fajar Putra Pamungkas</li>
          <li>Dzaka Musyaffa Hidayat</li>
          <li>Iqbal Rizky Maulana</li>
          <li>Mochammad Azka Basria</li>
        </ul>
      </div>

      <!-- Daftar Tombol Link -->
      <div class="flex flex-col w-full gap-4 mt-8">
        <RouterLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="group bg-white rounded-xl shadow-lg p-4 w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
        >
          <div class="flex items-center">
            <!-- Ikon dari data routes -->
            <Icon
              :icon="route.icon"
              class="w-7 h-7 text-blue-600 flex-shrink-0"
            />

            <!-- Teks (Nama Halaman) -->
            <span class="ml-4 text-lg font-semibold text-gray-900 text-left">
              {{ route.name }}
            </span>

            <!-- Ikon panah di kanan -->
            <Icon
              icon="heroicons:arrow-up-right-20-solid"
              class="w-5 h-5 text-gray-400 ml-auto transition-transform group-hover:scale-110 group-hover:text-blue-600"
            />
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
