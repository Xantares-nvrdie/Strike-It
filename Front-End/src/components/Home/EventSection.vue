<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api.js";

const events = ref([]); // State list event
const isLoading = ref(true);
const baseUrl = "http://localhost:3000";
const staticPrefix = "/uploads";

// Fetch Event Data
const fetchEvents = async () => {
  try {
    const response = await api.getEvents();

    // Mapping data dari backend
    events.value = response.data.map((evt) => {
      let imgPath = evt.img;
      // Normalisasi URL gambar
      if (imgPath && !imgPath.startsWith("http")) {
        const cleanPath = imgPath.startsWith("/")
          ? imgPath.substring(1)
          : imgPath;
        imgPath = `${baseUrl}${staticPrefix}/${cleanPath}`;
      }

      return {
        id: evt.id,
        imageUrl: imgPath,
        alt: evt.name,
        link: evt.link_url,
      };
    });
  } catch (error) {
    console.error("Gagal memuat event:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});

// --- Logika Slider Mobile (Touch Swipe) ---
const activeIndex = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);

// Simpan koordinat saat layar disentuh
function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
}

// Hitung geseran saat jari diangkat
function handleTouchEnd(e) {
  const diffX = e.changedTouches[0].clientX - touchStartX.value;
  const diffY = e.changedTouches[0].clientY - touchStartY.value;

  // Abaikan swipe vertikal (scroll biasa)
  if (Math.abs(diffY) > Math.abs(diffX)) return;

  const threshold = 50; // Jarak minimal swipe agar dianggap ganti slide
  const totalEvents = events.value.length;
  if (totalEvents === 0) return;

  // Logic ganti index slide
  if (Math.abs(diffX) > threshold) {
    if (diffX < 0) {
      // Swipe Kiri (Next)
      activeIndex.value = (activeIndex.value + 1) % totalEvents;
    } else {
      // Swipe Kanan (Prev)
      activeIndex.value = (activeIndex.value - 1 + totalEvents) % totalEvents;
    }
  }
}
</script>

<template>
  <div class="antialiased bg-gray-50 font-outfit">
    <section class="py-20">
      <div class="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2 class="text-4xl font-medium text-black md:text-6xl">
            Event & Perlombaan
          </h2>
          <p
            class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600"
          >
            Berbagai lomba dan event memancing seru dengan hadiah menarik
            menantimu!
          </p>
        </div>

        <div v-if="isLoading" class="text-center text-gray-500 py-12">
          Memuat event...
        </div>

        <div v-else>
          <div class="md:hidden mt-12">
            <div class="overflow-hidden">
              <div
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <div
                  v-for="event in events"
                  :key="event.id"
                  class="w-full flex-shrink-0 flex justify-center p-4"
                >
                  <div
                    class="overflow-hidden transition duration-300 transform bg-white rounded-xl shadow-lg w-full max-w-sm"
                  >
                    <img
                      :src="event.imageUrl"
                      :alt="event.alt"
                      class="object-cover w-full h-auto aspect-[3/4]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-center gap-2 py-4 mt-4">
              <button
                v-for="(event, index) in events"
                :key="index"
                @click="activeIndex = index"
                :class="activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'"
                class="size-3 rounded-full"
              ></button>
            </div>
          </div>

          <div class="hidden md:grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            <div
              v-for="event in events"
              :key="event.id"
              class="overflow-hidden transition duration-300 transform bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              <img
                :src="event.imageUrl"
                :alt="event.alt"
                class="object-cover w-full h-auto aspect-[3/4]"
              />
            </div>
          </div>
        </div>

        <div class="mt-16 text-center">
          <router-link to="/event">
            <button
              class="px-10 py-4 text-sm font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
            >
              Lihat Semua Event dan Perlombaan
            </button>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
