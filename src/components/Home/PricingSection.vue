<script setup>
import { ref } from 'vue';
import PricingCard from './PricingCard.vue';

// 1. Data plan disimpan dalam array agar mudah di-loop
const pricingPlans = ref([
  {
    title: "Kawan Mancing",
    subtitle: "Mancing cerdas. Kantong puas.",
    price: "75.000",
    features: [
      'Anda dapat menghentikan atau membatalkan kapan saja.',
      'Diskon 10% untuk sewa alat pancing.',
      'Voucher makan di restoran/kantin.',
      'Pemberian umpan dasar gratis saat kedatangan.',
    ],
    isPopular: false,
  },
  {
    title: "Juragan Mancing",
    subtitle: "Untuk Para Hobiis Sejati, Pilihan Paling Populer.",
    price: "100.000",
    features: [
      'Anda dapat menghentikan atau membatalkan kapan saja.',
      'Diskon 10% untuk sewa alat pancing.',
      'Diskon 20% untuk pembelian umpan.',
      'Pemberian umpan dasar gratis saat kedatangan.',
      'Kesempatan mengikuti turnamen bulanan secara gratis.',
    ],
    isPopular: true,
  },
  {
    title: "Jawara Mancing",
    subtitle: "Pengalaman Terbaik, Tanpa Batas dan Tanpa Kompromi.",
    price: "150.000",
    features: [
      'Anda dapat menghentikan atau membatalkan kapan saja.',
      'Diskon 10% untuk sewa alat pancing.',
      'Diskon 20% untuk pembelian umpan.',
      'Kesempatan mengikuti turnamen bulanan secara gratis.',
      'Satu sesi konsultasi mingguan dengan pemandu mancing profesional.',
    ],
    isPopular: false,
  },
]);

// 2. Logika untuk melacak kartu aktif dan swipe
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
  const totalPlans = pricingPlans.value.length;
  const currentTabIndex = activeIndex.value;

  if (Math.abs(diffX) > threshold) {
    if (diffX < 0) {
      // Swipe ke kiri (next)
      const nextIndex = (currentTabIndex + 1) % totalPlans;
      activeIndex.value = nextIndex;
    } else {
      // Swipe ke kanan (previous)
      const prevIndex = (currentTabIndex - 1 + totalPlans) % totalPlans;
      activeIndex.value = prevIndex;
    }
  }
}
</script>

<template>
  <section
    id="langganan"
    class="min-h-screen bg-white text-center pt-24 pb-16 font-['Outfit'] px-4 overflow-x-hidden"
  >
    <div>
      <h2 class="text-4xl font-medium text-black md:text-6xl">Langganan</h2>
      <p class="max-w-xl mx-auto mt-5 text-base leading-relaxed text-gray-600">
        Harga transparan, tanpa biaya tersembunyi. Bayar sekali di depan untuk
        paket pilihan Anda, nikmati mancing tanpa was-was.
      </p>
    </div>

    <!-- 
      3. Slider untuk Mobile (md:hidden) 
      Menggunakan transform untuk menggeser berdasarkan activeIndex
    -->
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
          <!-- Loop melalui plan -->
          <div
            v-for="(plan, index) in pricingPlans"
            :key="index"
            class="w-full flex-shrink-0 flex justify-center p-4"
          >
            <PricingCard
              :title="plan.title"
              :subtitle="plan.subtitle"
              :price="plan.price"
              :features="plan.features"
              :is-popular="plan.isPopular"
              class="h-full w-full max-w-sm"
            />
          </div>
        </div>
      </div>

      <!-- 4. Pagination Dots (seperti di contoh) -->
      <div class="flex justify-center gap-2 py-4 mt-4">
        <button
          v-for="(plan, index) in pricingPlans"
          :key="index"
          @click="activeIndex = index"
          :class="
            activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
          "
          class="size-3 rounded-full transition-colors"
          :aria-label="`Go to plan ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- 
      5. Tampilan Grid untuk Desktop (hidden md:flex) 
      Ini adalah layout asli Anda untuk desktop
    -->
    <div
      class="hidden md:flex items-stretch gap-6 mt-12 md:flex-wrap md:justify-center"
    >
      <PricingCard
        v-for="(plan, index) in pricingPlans"
        :key="index"
        :title="plan.title"
        :subtitle="plan.subtitle"
        :price="plan.price"
        :features="plan.features"
        :is-popular="plan.isPopular"
        class="md:w-[360px] h-full"
      />
    </div>
  </section>
</template>