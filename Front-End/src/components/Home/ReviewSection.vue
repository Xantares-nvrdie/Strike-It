<script setup>
import { ref, computed, onMounted } from "vue";
import ReviewCard from "./ReviewCard.vue";
import api from "@/services/api.js";

const reviews = ref([]);
const baseUrl = "http://localhost:3000";
const staticPrefix = "/uploads";

const fetchReviews = async () => {
  try {
    const response = await api.getPublicReviews();

    const originalData = response.data.map((item) => {
      // Logic Avatar User
      let avatarUrl = item.avatar_img;
      if (avatarUrl && !avatarUrl.startsWith("http")) {
        const cleanPath = avatarUrl.startsWith("/")
          ? avatarUrl.substring(1)
          : avatarUrl;
        avatarUrl = `${baseUrl}${staticPrefix}/${cleanPath}`;
      } else if (!avatarUrl) {
        // Avatar generator berdasarkan inisial nama
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user_name)}&background=random`;
      }

      return {
        id: item.id,
        author: item.user_name,
        title: item.location_name,
        avatar: avatarUrl,
        rating: item.rating,
        content: item.comment,
      };
    });

    // Duplikasi Data untuk Animasi Infinite Scroll
    // Agar scroll tidak putus, data dikalikan beberapa kali
    let multipliedData = [...originalData];
    for (let i = 1; i <= 4; i++) {
      multipliedData = [
        ...multipliedData,
        ...originalData.map((item) => ({
          ...item,
          // Buat ID unik dummy agar Vue tidak error (key duplicate)
          id: `${item.id}_copy_${i}`, // ID unik dummy
        })),
      ];
    }

    reviews.value = multipliedData;
  } catch (error) {
    console.error("Gagal memuat reviews:", error);
  }
};

onMounted(() => {
  fetchReviews();
});

// Membagi review menjadi 3 kolom
const column1Reviews = computed(() =>
  reviews.value.filter((_, i) => i % 3 === 0)
);
const column2Reviews = computed(() =>
  reviews.value.filter((_, i) => i % 3 === 1)
);
const column3Reviews = computed(() =>
  reviews.value.filter((_, i) => i % 3 === 2)
);
</script>

<template>
  <div
    id="penilaian"
    class="relative w-full overflow-hidden antialiased bg-gray-50 font-outfit"
  >
    <div
      class="absolute top-0 left-0 z-10 w-full h-48 pointer-events-none bg-gradient-to-b from-gray-50 via-gray-50 to-transparent"
    ></div>

    <div class="relative z-20 py-20 text-center">
      <h2 class="text-4xl font-medium text-black md:text-6xl">Penilaian</h2>
      <p class="max-w-xl mx-auto mt-5 text-base leading-relaxed text-gray-600">
        Kata mereka tentang pengalaman memancing di lokasi mitra Strike It.
      </p>
    </div>

    <div class="relative w-full max-w-7xl mx-auto h-[50rem] overflow-hidden">
      <div
        v-if="reviews.length === 0"
        class="flex justify-center items-center h-full text-gray-400"
      >
        Belum ada ulasan lokasi saat ini.
      </div>

      <div
        v-else
        class="absolute inset-0 grid grid-cols-1 gap-6 px-6 md:grid-cols-3"
      >
        <div class="flex flex-col gap-6 animate-scroll-down">
          <ReviewCard
            v-for="review in column1Reviews"
            :key="review.id"
            :review="review"
          />
          <ReviewCard
            v-for="review in column1Reviews"
            :key="`${review.id}-dup-anim`"
            :review="review"
          />
        </div>

        <div class="flex flex-col gap-6 animate-scroll-up">
          <ReviewCard
            v-for="review in column2Reviews"
            :key="review.id"
            :review="review"
          />
          <ReviewCard
            v-for="review in column2Reviews"
            :key="`${review.id}-dup-anim`"
            :review="review"
          />
        </div>

        <div class="flex flex-col gap-6 animate-scroll-down">
          <ReviewCard
            v-for="review in column3Reviews"
            :key="review.id"
            :review="review"
          />
          <ReviewCard
            v-for="review in column3Reviews"
            :key="`${review.id}-dup-anim`"
            :review="review"
          />
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-0 left-0 z-10 w-full h-48 pointer-events-none bg-gradient-to-t from-blue-700 to-transparent"
    ></div>
  </div>
</template>

<style scoped>
/* Keyframes Animasi Scroll Vertikal */
@keyframes scroll-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
@keyframes scroll-down {
  from {
    transform: translateY(-50%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-scroll-up {
  animation: scroll-up 100s linear infinite;
} /* Diperlambat sedikit biar smooth */
.animate-scroll-down {
  animation: scroll-down 100s linear infinite;
}
/* Pause saat di-hover agar user bisa baca */
.animate-scroll-up:hover,
.animate-scroll-down:hover {
  animation-play-state: paused;
}
</style>
