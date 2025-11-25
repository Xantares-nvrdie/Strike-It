<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router"; // Import useRoute
import api from "@/services/api.js"; // Import API

const route = useRoute();
const activeTab = ref("deskripsi");

const setTab = (tabName) => {
  activeTab.value = tabName;
};

// State Review (Ganti dari data dummy)
const reviews = ref([]);

// Fetch Data Review dari Database
const fetchReviews = async () => {
  const productId = route.params.id; // Ambil ID dari URL
  if (!productId) return;

  try {
    const res = await api.getProductReviews(productId);

    // Mapping data DB ke format UI
    reviews.value = res.data.map((r) => ({
      id: r.id,
      username: r.username,
      rating: r.rating,
      comment: r.comment,
      // Format tanggal: YYYY-MM-DD
      date: new Date(r.created_at).toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Gagal memuat review:", error);
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<template>
  <section
    class="self-stretch p-6 bg-linear-131 from-white/20 to-gray-50/20 rounded-[37px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] outline outline-[2.50px] outline-offset-[-2.50px] outline-white backdrop-blur-sm flex flex-col justify-start items-center gap-8"
  >
    <div
      role="tablist"
      class="flex flex-row items-center justify-center gap-8 sm:flex-row md:gap-14"
    >
      <button
        role="tab"
        :aria-selected="activeTab === 'deskripsi'"
        @click="setTab('deskripsi')"
        class="w-36 h-8 text-center text-xl font-outfit uppercase leading-8 transition-all duration-200"
        :class="
          activeTab === 'deskripsi'
            ? 'font-bold text-black border-b-2 border-black'
            : 'font-normal text-stone-500 hover:text-black hover:border-b hover:border-gray-400'
        "
      >
        DESKRIPSI
      </button>

      <button
        role="tab"
        :aria-selected="activeTab === 'penilaian'"
        @click="setTab('penilaian')"
        class="w-36 h-8 text-center text-xl font-outfit uppercase leading-8 transition-all duration-200"
        :class="
          activeTab === 'penilaian'
            ? 'font-bold text-black border-b-2 border-black'
            : 'font-normal text-stone-500 hover:text-black hover:border-b hover:border-gray-400'
        "
      >
        PENILAIAN ({{ reviews.length }})
      </button>
    </div>

    <div role="tabpanel" class="w-full">
      <div v-if="activeTab === 'deskripsi'">
        <p class="text-black text-base font-normal font-outfit leading-7">
          Oceanic Predator Pro adalah joran yang dirancang untuk performa dan
          keserbagunaan. Dibuat dengan blank carbon berkualitas tinggi yang
          ringan namun kuat, joran ini memberikan sensitivitas luar biasa untuk
          mendeteksi getaran umpan dan sambaran ikan terkecil sekalipun, serta
          kekuatan yang cukup untuk menaklukkan ikan predator.
        </p>
      </div>

      <div v-else-if="activeTab === 'penilaian'" class="w-full">
        <div
          v-if="reviews.length === 0"
          class="text-center text-gray-600 text-lg font-outfit"
        >
          Belum ada ulasan. Jadilah yang pertama memberikan penilaian!
        </div>
        <ul
          v-else
          class="flex flex-col divide-y divide-gray-200/50 w-full max-w-5xl mx-auto"
        >
          <li
            v-for="review in reviews"
            :key="review.id"
            class="p-6 flex items-start gap-4"
          >
            <div
              class="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full font-semibold text-gray-700"
            >
              {{ review.username.charAt(0).toUpperCase() }}
            </div>

            <div class="flex-1 text-left">
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between"
              >
                <div class="mb-2 sm:mb-0">
                  <h4 class="font-semibold text-gray-900">
                    {{ review.username }}
                  </h4>
                  <span class="text-sm text-gray-500">{{ review.date }}</span>
                </div>
                <div class="flex items-center text-yellow-500">
                  <template v-for="i in 5" :key="i">
                    <Icon
                      v-if="i <= Math.floor(review.rating)"
                      icon="mdi:star"
                      class="w-5 h-5"
                    />
                    <Icon
                      v-else-if="i - review.rating <= 0.5"
                      icon="mdi:star-half-full"
                      class="w-5 h-5"
                    />
                    <Icon v-else icon="mdi:star-outline" class="w-5 h-5" />
                  </template>
                </div>
              </div>

              <p class="mt-2 text-gray-800 font-outfit leading-7">
                {{ review.comment }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
