<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api.js";
import DiscountCard from "./DiscountCard.vue"; // Import komponen anak

// State untuk data diskon
const discounts = ref([]);
const isLoading = ref(true);

// State untuk logika karusel (swipe)
const activeIndex = ref(0); // Ubah default ke 0 (array index start)
const touchStartX = ref(0);
const touchStartY = ref(0);

const fetchDiscounts = async () => {
  try {
    const response = await api.getDiscounts();

    // Mapping data dari database (snake_case) ke prop component
    discounts.value = response.data.map((item) => ({
      id: item.id,
      discount: item.discount_value, // DB: discount_value -> Prop: discount
      code: item.code,
      // Format string usage: "122 dari 130 kupon sudah terpakai"
      usage: `${item.used_count} dari ${item.max_usage} kupon sudah terpakai`,
    }));
  } catch (error) {
    console.error("Error loading discounts:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data saat komponen dimuat
onMounted(() => {
  fetchDiscounts();
});

// --- LOGIKA KARUSEL (Touch Handler) ---
function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const finalX = e.changedTouches[0].clientX;
  const finalY = e.changedTouches[0].clientY;

  const diffX = finalX - touchStartX.value;
  const diffY = finalY - touchStartY.value;

  // Abaikan jika user melakukan scrolling vertikal
  if (Math.abs(diffY) > Math.abs(diffX)) {
    return;
  }

  const threshold = 50;
  const totalDiscounts = discounts.value.length;

  // Hindari error division by zero jika data belum dimuat
  if (totalDiscounts === 0) return;

  const currentTabIndex = activeIndex.value;

  if (Math.abs(diffX) > threshold) {
    if (diffX < 0) {
      // Swipe ke kiri (Next)
      activeIndex.value = (currentTabIndex + 1) % totalDiscounts;
    } else {
      // Swipe ke kanan (Prev)
      activeIndex.value =
        (currentTabIndex - 1 + totalDiscounts) % totalDiscounts;
    }
  }
}
</script>

<template>
  <section
    id="diskon"
    class="min-h-screen/2 bg-white text-center pt-24 pb-16 font-['Outfit'] overflow-x-hidden"
  >
    <div class="px-4 header-diskon">
      <h2 class="text-4xl font-medium text-black md:text-6xl">
        Diskon Spesial
      </h2>
      <p class="max-w-xl mx-auto mt-5 text-base leading-relaxed text-gray-600">
        Lebih dari 1.300 orang telah menghemat lebih dari Rp.50.000.000 dengan
        kupon Strike It.
      </p>
    </div>

    <div v-if="isLoading" class="mt-12 text-gray-400">Memuat diskon...</div>

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
              v-for="discount in discounts"
              :key="discount.id"
              class="w-full flex-shrink-0 flex justify-center p-4"
            >
              <DiscountCard
                :discount="discount.discount"
                :code="discount.code"
                :usage="discount.usage"
                class="w-full max-w-sm"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-2 py-4 mt-4">
          <button
            v-for="(discount, index) in discounts"
            :key="index"
            @click="activeIndex = index"
            :class="activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'"
            class="size-3 rounded-full transition-colors"
            :aria-label="`Go to discount ${index + 1}`"
          ></button>
        </div>
      </div>

      <div
        class="hidden md:flex flex-wrap justify-center gap-6 px-4 mt-12 md:px-10"
      >
        <DiscountCard
          v-for="discount in discounts"
          :key="discount.id"
          :discount="discount.discount"
          :code="discount.code"
          :usage="discount.usage"
          class="md:w-[360px]"
        />
      </div>
    </div>
  </section>
</template>
