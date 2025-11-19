<script setup>
import { ref } from 'vue';
import PricingCard from './PricingCard.vue';
import { Icon } from '@iconify/vue'; // <-- 1. Tambahkan Icon untuk modal

// Data plan (tidak berubah)
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

// Logika slider (tidak berubah)
const activeIndex = ref(1);
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
  if (Math.abs(diffY) > Math.abs(diffX)) {
    return;
  }
  const tapThreshold = 10;
  const swipeThreshold = 50;
  if (Math.abs(diffX) < tapThreshold && Math.abs(diffY) < tapThreshold) {
    return;
  }
  if (Math.abs(diffX) > swipeThreshold) {
    e.preventDefault(); 
    const totalPlans = pricingPlans.value.length;
    const currentTabIndex = activeIndex.value;
    if (diffX < 0) {
      const nextIndex = (currentTabIndex + 1) % totalPlans;
      activeIndex.value = nextIndex;
    } else {
      const prevIndex = (currentTabIndex - 1 + totalPlans) % totalPlans;
      activeIndex.value = prevIndex;
    }
  }
}

// 2. LOGIKA MODAL (DIPINDAH KE SINI)
const isModalOpen = ref(false);
const selectedPlan = ref(null);

function openModal(plan) {
  selectedPlan.value = plan;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  // Kita tunda reset selectedPlan agar data di modal tidak hilang saat transisi
  setTimeout(() => {
    selectedPlan.value = null;
  }, 300); // 300ms = durasi transisi
}

function confirmCheckout() {
  alert(`Memproses pembayaran untuk ${selectedPlan.value.title}...`);
  closeModal();
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

    <div class="md:hidden mt-12">
      <div class="overflow-hidden">
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
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
              @subscribe="openModal(plan)"
            />
          </div>
        </div>
      </div>

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
        @subscribe="openModal(plan)"
      />
    </div>
  </section>

  <Transition name="fade">
    <div
      v-if="isModalOpen"
      @click="closeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-['Outfit']"
    >
      <div
        @click.stop
        class="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 relative"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon icon="mdi:close" class="w-7 h-7" />
        </button>

        <div class="text-center">
          <Icon icon="heroicons:shopping-cart-solid" class="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">
            Konfirmasi Langganan
          </h2>
          <p class="text-gray-600 mb-6">
            Anda akan berlangganan paket berikut:
          </p>

          <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">Paket:</span>
              <span class="text-lg font-semibold text-gray-900">{{ selectedPlan?.title }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Harga:</span>
              <span class="text-lg font-semibold text-gray-900">Rp{{ selectedPlan?.price }}/bulan</span>
            </div>
          </div>
          
          <button
            @click="confirmCheckout"
            class="w-full mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Konfirmasi & Bayar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
