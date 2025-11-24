<script setup>
// Import hooks Vue dan komponen anak
import { ref, onMounted } from "vue";
import EventCard from "./EventCard.vue";
import api from "@/services/api.js"; // Service untuk komunikasi ke Backend

// State reaktif untuk menampung array event dari database
const events = ref([]);

// Konfigurasi URL Gambar
// baseUrl: Alamat server backend (Express.js)
const baseUrl = "http://localhost:3000";
const staticPrefix = "/uploads";

// Fungsi Fetch Data Event dari API
const fetchEvents = async () => {
  try {
    // Request GET ke endpoint /events
    const response = await api.getEvents();

    // Mapping Data: Mengubah format data dari database (Raw) ke format UI
    events.value = response.data.map((evt) => {
      let imgPath = evt.img;

      // Logika Normalisasi URL Gambar:
      // 1. Cek apakah gambar ada dan BUKAN link eksternal (seperti https://imgur...)
      if (imgPath && !imgPath.startsWith("http")) {
        // 2. Hapus slash depan jika ada, lalu gabungkan dengan base URL backend
        const cleanPath = imgPath.startsWith("/")
          ? imgPath.substring(1)
          : imgPath;
        imgPath = `${baseUrl}${staticPrefix}/${cleanPath}`;
      }

      // Return object baru yang sesuai dengan props di EventCard.vue
      return {
        id: evt.id,
        imageUrl: imgPath,
        title: evt.name,
        author: "Admin Strike It", // Hardcode sementara atau ambil dari relasi user
        date: "Segera Hadir", // Bisa diganti dengan logic format tanggal
        externalLink: evt.link_url, // Link pendaftaran/detail
      };
    });
  } catch (error) {
    console.error("Gagal memuat data event:", error);
  }
};

// Lifecycle Hook: Jalankan fetchEvents saat komponen dipasang ke layar (mounted)
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <section class="w-full bg-gray-50 py-16">
    <div class="max-w-6xl mx-auto px-4 text-center space-y-12">
      <h1 class="text-4xl font-medium text-black md:text-6xl">
        Event & Perlombaan
      </h1>

      <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
        Temukan berbagai event dan perlombaan mancing seru yang bisa kamu ikuti
        untuk menguji keterampilan dan keberuntunganmu.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div>
    </div>
  </section>
</template>
