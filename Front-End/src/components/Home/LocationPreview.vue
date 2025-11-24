<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api"; // Import API service

// State data
const locations = ref([]); // Menyimpan list lokasi dari backend
const selectedIndex = ref(0); // Index lokasi yang sedang aktif/ditampilkan

// Definisi URL Backend untuk gambar
const baseUrl = "http://localhost:3000";
const staticPrefix = "/uploads";

// Fetch Data Lokasi
const fetchLocations = async () => {
  try {
    const res = await api.getLocations();
    locations.value = res.data;
  } catch (error) {
    console.error("Gagal mengambil lokasi:", error);
  }
};

// Computed Property: Mengambil data lokasi yang SEDANG DIPILIH
// Logic ini otomatis update jika selectedIndex berubah
const selectedLocation = computed(() => {
  // Fallback jika data belum ada
  if (locations.value.length === 0)
    return {
      name: "Loading...",
      city: "Loading...",
      img: "https://placehold.co/800x400?text=Loading",
    };

  const loc = locations.value[selectedIndex.value];

  // Normalisasi URL Gambar (tambahkan localhost jika perlu)
  let imagePath = loc.img;
  if (imagePath && !imagePath.startsWith("http")) {
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;
    imagePath = `${baseUrl}${staticPrefix}/${cleanPath}`;
  }

  return {
    ...loc,
    img: imagePath,
  };
});

// Fungsi Navigasi Next/Prev
const next = () => {
  if (locations.value.length > 0) {
    // Modulo (%) digunakan agar index berputar (looping)
    selectedIndex.value = (selectedIndex.value + 1) % locations.value.length;
  }
};

const prev = () => {
  if (locations.value.length > 0) {
    selectedIndex.value =
      (selectedIndex.value - 1 + locations.value.length) %
      locations.value.length;
  }
};

// Lifecycle Hook
onMounted(fetchLocations);
</script>

<template>
  <div id="preview" class="min-h-screen antialiased bg-gray-50 font-outfit">
    <section class="pt-24 pb-16 text-center bg-white">
      <div class="max-w-4xl px-4 mx-auto">
        <h2 class="text-4xl font-medium text-black md:text-6xl">
          Lokasi Tempat Pemancingan
        </h2>
        <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
          Jelajahi destinasi pemancingan terbaik di sekitar Anda.
        </p>
      </div>

      <div class="px-4 mt-12">
        <ul
          class="flex items-center px-2 py-2 space-x-3 overflow-x-auto md:space-x-5 md:px-0 scrollbar-hide justify-center"
        >
          <li>
            <button
              @click="prev"
              class="flex items-center justify-center w-10 h-10..."
            >
              <svg ...></svg>
            </button>
          </li>

          <li class="flex-shrink-0 block md:hidden">
            <button class="... bg-blue-600 text-white ...">
              {{ selectedLocation.city }}
            </button>
          </li>

          <template
            v-for="(location, index) in locations"
            :key="location.id || index"
          >
            <li class="hidden md:flex flex-shrink-0">
              <button
                @click="selectedIndex = index"
                :class="[
                  'flex items-center justify-center w-24 h-10 px-4 rounded-full ...',
                  index === selectedIndex
                    ? 'bg-blue-600 text-white ...' // Style Aktif
                    : 'bg-white/10 text-gray-800 ...', // Style Tidak Aktif
                ]"
              >
                {{ location.city }}
              </button>
            </li>
          </template>

          <li>
            <button
              @click="next"
              class="flex items-center justify-center w-10 h-10 ..."
            >
              <svg ...></svg>
            </button>
          </li>
        </ul>
      </div>

      <div class="flex flex-col items-center p-4 mx-auto mt-10">
        <img
          :src="selectedLocation.img"
          :alt="selectedLocation.name"
          class="object-cover w-full max-w-4xl transition duration-300 shadow-2xl h-72 rounded-t-2xl hover:shadow-3xl"
          @error="
            (e) => {
              e.target.onerror = null;
              e.target.src =
                'https://placehold.co/800x400/9CA3AF/FFFFFF?text=No+Image';
            }
          "
        />

        <router-link
          :to="
            selectedLocation.id
              ? `/location/${selectedLocation.id}/book`
              : '/location'
          "
          class="w-full max-w-4xl"
        >
          <button
            class="w-full py-4 text-xl font-bold tracking-wider text-white uppercase transition duration-300 ease-in-out bg-blue-600 shadow-xl font-outfit rounded-b-2xl hover:bg-blue-700 hover:shadow-2xl"
          >
            Booking Sekarang
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>
