<script setup>
// Import dependency Vue dan komponen-komponen child
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import BookingCard from "@/components/Booking/BookingCard.vue";
import LocationMapCard from "@/components/Booking/LocationMapCard.vue";
import ReviewCard from "@/components/Booking/ReviewCard.vue";
import api from "@/services/api.js";

const route = useRoute(); // Untuk ambil ID dari URL
const locationData = ref(null); // Data detail lokasi
const reviews = ref([]); // Data review lokasi
const baseUrl = "http://localhost:3000/uploads";

// State UI
const activeTab = ref("about"); // Tab aktif di tampilan mobile (about/location/review)
const isBookingModalOpen = ref(false); // Pop-up booking untuk mobile
const tabs = ["about", "location", "review"]; // Daftar tab untuk logika swipe
const tabContentRef = ref(null);
const touchStartX = ref(0); // Koordinat awal sentuhan layar
const touchStartY = ref(0);

// Helper URL Gambar
const getFullUrl = (path) => {
  if (!path) return "https://placehold.co/800x600?text=No+Image";
  return path.startsWith("http") ? path : `${baseUrl}/${path}`;
};

// --- FETCH DATA ---
const fetchData = async () => {
  const id = route.params.id; // Ambil ID dari URL, misal: /location/5
  try {
    // 1. Ambil Detail Lokasi dari Backend
    const locRes = await api.getLocationDetail(id);
    const loc = locRes.data;

    // --- LOGIKA GAMBAR (Main + Gallery) ---
    // Backend mengirim array 'images' via JOIN (jika sudah diupdate)
    // Jika belum, pakai fallback ke loc.img utama
    const allImages = loc.images || [];

    // Cari gambar tipe 'main' (atau pakai cover default)
    const mainImgObj = allImages.find((i) => i.img_type === "main") || {
      img_path: loc.img,
    };

    // Cari gambar tipe 'gallery' untuk thumbnail
    const galleryImages = allImages.filter((i) => i.img_type === "gallery");
    // Ambil 2 gambar pertama dari gallery, jika tidak ada pakai gambar utama sebagai fallback
    const thumb1Obj = galleryImages[0] || { img_path: loc.img };
    const thumb2Obj = galleryImages[1] || { img_path: loc.img };

    // Mapping data ke state local
    locationData.value = {
      id: loc.id,
      name: loc.name,
      city: loc.city,
      description: loc.description,
      price: loc.price_per_hour,

      // Koordinat Peta (Default Monas jika database kosong/null)
      lat: loc.lat || -6.175392,
      lng: loc.lng || 106.827152,

      // Assign URL Gambar
      mainImage: getFullUrl(mainImgObj.img_path),
      thumb1: getFullUrl(thumb1Obj.img_path),
      thumb2: getFullUrl(thumb2Obj.img_path),
    };

    // 2. Ambil Review Lokasi dari Backend
    const revRes = await api.getLocationReviews(id);
    reviews.value = revRes.data.map((r) => ({
      id: r.id,
      username: r.username,
      // Handle avatar user
      avatarUrl: r.avatarUrl
        ? getFullUrl(r.avatarUrl)
        : `https://ui-avatars.com/api/?name=${r.username}&background=random`,
      date: new Date(r.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      rating: r.rating,
      comment: r.comment,
      isCurrentUser: false,
    }));
  } catch (error) {
    console.error("Gagal memuat detail lokasi:", error);
  }
};

onMounted(() => {
  fetchData();
});

// --- LOGIKA SWIPE (MOBILE ONLY) ---
// Mendeteksi geseran jari kiri/kanan untuk ganti tab
function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const diffX = e.changedTouches[0].clientX - touchStartX.value;
  const diffY = e.changedTouches[0].clientY - touchStartY.value;

  // Jika user scroll vertikal (atas-bawah), abaikan swipe tab
  if (Math.abs(diffY) > Math.abs(diffX)) return;

  // Jika geseran horizontal > 50px, ganti tab
  if (Math.abs(diffX) > 50) {
    const current = tabs.indexOf(activeTab.value);
    if (diffX < 0) {
      // Swipe Kiri -> Next Tab
      activeTab.value = tabs[(current + 1) % tabs.length];
    } else {
      // Swipe Kanan -> Prev Tab
      activeTab.value = tabs[(current - 1 + tabs.length) % tabs.length];
    }
  }
}
</script>

<template>
  <div
    v-if="!locationData"
    class="flex flex-col justify-center items-center h-screen text-gray-500 gap-4"
  >
    <div
      class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"
    ></div>
    <p>Memuat informasi lokasi...</p>
  </div>

  <main
    v-else
    class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
  >
    <div
      class="lg:col-span-2 w-full bg-zinc-100 rounded-3xl shadow-xl p-4 md:p-8 lg:p-12 flex flex-col gap-8"
    >
      <div class="text-center mb-0 md:mb-4">
        <h1 class="text-4xl font-medium text-[#1e2f42] md:text-6xl">
          {{ locationData.name }}
        </h1>
        <p class="max-w-2xl mx-auto mt-1 text-lg leading-relaxed text-gray-600">
          {{ locationData.city }}
        </p>
      </div>

      <div class="hidden md:flex flex-col gap-8">
        <div class="flex flex-col gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              :src="locationData.mainImage"
              alt="Lokasi Utama"
              class="w-full h-auto object-cover rounded-2xl shadow-lg col-span-2 aspect-video"
            />

            <img
              :src="locationData.thumb1"
              alt="Galeri 1"
              class="w-full h-48 object-cover rounded-2xl shadow-lg"
            />

            <img
              :src="locationData.thumb2"
              alt="Galeri 2"
              class="w-full h-48 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div
            class="bg-[#eeeeee] border-white border-4 rounded-2xl shadow-xl p-6 md:p-8"
          >
            <h3 class="text-3xl font-medium text-center text-gray-900 mb-4">
              Tentang tempat ini
            </h3>
            <div
              class="space-y-4 text-gray-700 leading-relaxed text-justify whitespace-pre-line"
            >
              <p>{{ locationData.description }}</p>
            </div>
          </div>

          <div
            class="bg-zinc-100 border-white border-4 rounded-2xl shadow-xl p-6 md:p-8"
          >
            <h3 class="text-3xl font-medium text-center text-gray-900 mb-6">
              Penilaian Tempat
            </h3>
            <div class="flex flex-col gap-6">
              <ReviewCard
                v-for="review in reviews"
                :key="review.id"
                :review="review"
              />
              <div
                v-if="reviews.length === 0"
                class="text-center text-gray-500 italic py-4"
              >
                Belum ada ulasan untuk lokasi ini. Jadilah yang pertama!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="block md:hidden space-y-4">
        <div class="relative w-full">
          <img
            :src="locationData.mainImage"
            alt="Main Location"
            class="w-full h-64 object-cover rounded-2xl shadow-lg"
          />

          <div
            class="absolute inset-0 flex justify-between items-center px-2 pointer-events-none"
          >
            <button
              class="bg-white/70 rounded-full p-1 text-black shadow-md pointer-events-auto hover:bg-white"
            >
              <Icon icon="mdi:chevron-left" class="size-6" />
            </button>
            <button
              class="bg-white/70 rounded-full p-1 text-black shadow-md pointer-events-auto hover:bg-white"
            >
              <Icon icon="mdi:chevron-right" class="size-6" />
            </button>
          </div>
        </div>

        <button
          @click="isBookingModalOpen = true"
          class="w-full bg-blue-600 text-white text-xl font-medium py-4 rounded-xl shadow-lg my-4 active:scale-95 transition-transform"
        >
          Book sekarang
        </button>

        <div class="flex justify-center gap-2 py-2">
          <button
            @click="activeTab = 'about'"
            :class="
              activeTab === 'about' ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3'
            "
            class="h-3 rounded-full transition-all duration-300"
          ></button>
          <button
            @click="activeTab = 'location'"
            :class="
              activeTab === 'location' ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3'
            "
            class="h-3 rounded-full transition-all duration-300"
          ></button>
          <button
            @click="activeTab = 'review'"
            :class="
              activeTab === 'review' ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3'
            "
            class="h-3 rounded-full transition-all duration-300"
          ></button>
        </div>

        <div
          ref="tabContentRef"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div
            class="bg-[#eeeeee] border-4 border-white rounded-2xl shadow-xl p-6 min-h-[300px]"
          >
            <div v-if="activeTab === 'about'" class="animate-fade-in">
              <h3 class="text-2xl font-medium text-center text-gray-900 mb-4">
                Tentang tempat ini
              </h3>
              <div
                class="space-y-4 text-gray-700 leading-relaxed text-justify whitespace-pre-line"
              >
                <p>{{ locationData.description }}</p>
              </div>
            </div>

            <div v-if="activeTab === 'location'" class="animate-fade-in">
              <h3 class="text-2xl font-medium text-center text-gray-900 mb-4">
                Peta Lokasi
              </h3>
              <LocationMapCard
                :lat="locationData.lat"
                :lng="locationData.lng"
              />
            </div>

            <div v-if="activeTab === 'review'" class="animate-fade-in">
              <h3 class="text-2xl font-medium text-center text-gray-900 mb-4">
                Rating & Review
              </h3>
              <div class="flex flex-col gap-4">
                <ReviewCard
                  v-for="review in reviews"
                  :key="review.id"
                  :review="review"
                />
                <p
                  v-if="reviews.length === 0"
                  class="text-center text-gray-500 italic"
                >
                  Belum ada ulasan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden lg:block lg:col-span-1">
      <div class="sticky top-24 flex flex-col gap-8">
        <BookingCard
          :price="Number(locationData.price)"
          :locationId="locationData.id"
        />

        <LocationMapCard :lat="locationData.lat" :lng="locationData.lng" />
      </div>
    </div>

    <div
      v-if="isBookingModalOpen"
      @click="isBookingModalOpen = false"
      class="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
    >
      <div
        @click.stop
        class="relative bg-white rounded-2xl p-4 pt-10 shadow-2xl w-full max-w-md animate-slide-up"
      >
        <button
          @click="isBookingModalOpen = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <Icon icon="mdi:close" class="size-8" />
        </button>
        <BookingCard
          :price="Number(locationData.price)"
          :locationId="locationData.id"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Simple fade animation for tabs */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide up animation for modal */
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
