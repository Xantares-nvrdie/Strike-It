<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import LocationCard from "@/components/Booking/LocationCard.vue";
import api from "@/services/api.js"; // Import API: Jembatan ke Backend

const locations = ref([]); // Menyimpan array lokasi dari API
const baseUrl = "http://localhost:3000/uploads"; // Prefix URL gambar backend

// Fungsi Fetch Data
const fetchLocations = async () => {
  try {
    const response = await api.getLocations(); // GET /locations
    locations.value = response.data.map((loc) => ({
      // Map data API ke format yang dibutuhkan komponen
      id: loc.id,
      city: loc.city,
      address: loc.address,
      description: loc.description,
      // Logika Gambar:
      // 1. Jika ada img, cek apakah link eksternal (http) atau lokal.
      // 2. Jika lokal, tambahkan baseUrl.
      // 3. Jika null, pakai placeholder.
      imageUrl: loc.img
        ? loc.img.startsWith("http")
          ? loc.img
          : `${baseUrl}/${loc.img}`
        : "https://placehold.co/600x400",
    }));
  } catch (error) {
    console.error("Gagal load lokasi", error);
  }
};

// Panggil fetch saat halaman selesai dimuat
onMounted(() => {
  fetchLocations();
});
</script>

<template>
  <div class="text-center my-10">
    <h1 class="text-4xl font-medium text-black md:text-6xl">Detail Lokasi</h1>
    <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
      Jelajahi berbagai cabang lokasi memancing Strike It! di seluruh Indonesia.
      Temukan tempat terbaik untuk menikmati hobi memancing Anda.
    </p>
  </div>
  <div class="flex justify-center items-center flex-col gap-5 mb-24">
    <LocationCard
      class=""
      v-for="location in locations"
      :key="location.id"
      :location="location"
    />
  </div>
</template>
