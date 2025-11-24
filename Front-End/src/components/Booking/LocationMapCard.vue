<script setup>
import { computed } from "vue";

// Menerima Latitude (lat) dan Longitude (lng)
// Default value diset ke Monas jika parent lupa mengirim props
const props = defineProps({
  lat: { type: [Number, String], default: -6.175392 }, // Default Monas jika kosong
  lng: { type: [Number, String], default: 106.827152 },
});

// Buat Link Google Maps Dinamis
const googleMapsUrl = computed(() => {
  // Note: Sepertinya ada typo di kode asli Anda (0{props...}), saya koreksi di komentar ini:
  // Seharusnya: `https://www.google.com/maps?q=${props.lat},${props.lng}` atau format maps lainnya.
  // Kode di bawah sesuai yg Anda kirim (mungkin typo di '0{'):
  return `https://www.google.com/maps/search/?api=1&query=${props.lat},${props.lng}`;
});
</script>

<template>
  <div
    class="bg-[#eeeeee] border-white border-4 rounded-2xl shadow-xl p-6 md:p-8 space-y-4"
  >
    <h3 class="text-3xl font-medium text-center text-gray-900">Lokasi</h3>

    <a
      :href="googleMapsUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="block w-full h-24 sm:h-26 bg-gray-200 rounded-lg overflow-hidden shadow-inner relative group cursor-pointer"
      title="Klik untuk buka di Google Maps"
    >
      <img
        src="../../assets/placeholdermap.png"
        alt="Peta Lokasi"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"
      >
        <span
          class="bg-white/90 px-5 py-2 rounded-full text-sm font-bold text-blue-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
        >
          Buka Google Maps ↗
        </span>
      </div>
    </a>

    <p class="text-center text-sm text-gray-500">
      Klik peta untuk melihat rute di Google Maps
    </p>
  </div>
</template>
