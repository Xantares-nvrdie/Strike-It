<script setup>
import { ref } from "vue";
import DiscountCard from "./DiscountCard.vue";

// 1. Data kupon dipindahkan ke array reaktif
const discounts = ref([
  {
    id: 1,
    discount: "15%",
    code: "AASNAAD998",
    usage: "122 dari 130 kupon sudah terpakai",
  },
  {
    id: 2,
    discount: "15%",
    code: "ASD12229SDA",
    usage: "122 dari 130 kupon sudah terpakai",
  },
  {
    id: 3,
    discount: "15%",
    code: "ADAD9988",
    usage: "122 dari 130 kupon sudah terpakai",
  },
]);

// --- LOGIKA KARUSEL DITAMBAHKAN ---

// 2. State untuk melacak kartu aktif dan swipe
const activeIndex = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);

function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const finalX = e.changedTouches[0].clientX;
  const finalY = e.changedTouches[0].clientY;

  const diffX = finalX - touchStartX.value;
  const diffY = finalY - touchStartY.value;

  // Abaikan jika swipe lebih dominan vertikal (untuk scrolling)
  if (Math.abs(diffY) > Math.abs(diffX)) {
    return;
  }

  const threshold = 50; // Jarak minimum swipe
  const totalDiscounts = discounts.value.length; // Diadaptasi untuk 'discounts'
  const currentTabIndex = activeIndex.value;

  if (Math.abs(diffX) > threshold) {
    if (diffX < 0) {
      // Swipe ke kiri (next)
      const nextIndex = (currentTabIndex + 1) % totalDiscounts;
      activeIndex.value = nextIndex;
    } else {
      // Swipe ke kanan (previous)
      const prevIndex = (currentTabIndex - 1 + totalDiscounts) % totalDiscounts;
      activeIndex.value = prevIndex;
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
      <h2 class="text-4xl font-medium text-black md:text-6xl">Diskon Spesial</h2>
      <p class="max-w-xl mx-auto mt-5 text-base leading-relaxed text-gray-600">
        Lebih dari 1.300 orang telah menghemat lebih dari Rp.50.000.000 dengan
        kupon Strike It.
      </p>
    </div>

    <!-- 3. SLIDER UNTUK MOBILE (md:hidden) -->
    <div class="md:hidden mt-12">
      <!-- Wrapper untuk menyembunyikan overflow -->
      <div class="overflow-hidden">
        <!-- Container yang bergerak (transform) -->
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- Loop melalui diskon -->
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

      <!-- Pagination Dots -->
      <div class="flex justify-center gap-2 py-4 mt-4">
        <button
          v-for="(discount, index) in discounts"
          :key="index"
          @click="activeIndex = index"
          :class="
            activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
          "
          class="size-3 rounded-full transition-colors"
          :aria-label="`Go to discount ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- 
      4. Tampilan Flex-Wrap untuk Desktop (hidden md:flex) 
      Ini adalah layout asli Anda untuk desktop
    -->
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
  </section>
</template>