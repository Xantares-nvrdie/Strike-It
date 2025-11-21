<script setup>
import { ref, onMounted, computed } from 'vue';
import PricingCard from './PricingCard.vue';
import { Icon } from '@iconify/vue';
import api from '@/services/api'; // Import API Service

// Data plan (Awalnya kosong, diisi dari API)
const pricingPlans = ref([]);

// Mengambil data membership dari Backend
const fetchMemberships = async () => {
  try {
    const response = await api.getMemberships();
    // Mapping data DB ke format Frontend
    pricingPlans.value = response.data.map(plan => ({
      id: plan.id,
      title: plan.name,
      subtitle: plan.description,
      price: Number(plan.price_per_month).toLocaleString('id-ID'), 
      features: plan.benefits ? plan.benefits.split('\n').filter(f => f.trim()) : [],
      isPopular: Boolean(plan.is_popular)
    }));
  } catch (error) {
    console.error("Gagal memuat paket langganan:", error);
  }
};

// --- LOGIKA SUSUNAN PLAN (Agar Populer di Tengah) ---
const sortedPlans = computed(() => {
  if (pricingPlans.value.length === 0) return [];
  
  // Pisahkan plan populer dan biasa
  const popular = pricingPlans.value.find(p => p.isPopular);
  const regular = pricingPlans.value.filter(p => !p.isPopular);

  // Jika ada plan populer, taruh di tengah (index ke-1 dari 3 item)
  // Struktur: [Biasa 1, POPULER, Biasa 2]
  if (popular && regular.length >= 2) {
    return [regular[0], popular, regular[1], ...regular.slice(2)];
  }
  
  // Fallback jika datanya tidak standar (misal cuma 2 plan)
  return pricingPlans.value;
});

// Logika slider (Original)
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
  if (Math.abs(diffY) > Math.abs(diffX)) return;
  const tapThreshold = 10;
  const swipeThreshold = 50;
  if (Math.abs(diffX) < tapThreshold && Math.abs(diffY) < tapThreshold) return;
  if (Math.abs(diffX) > swipeThreshold) {
    e.preventDefault(); 
    const totalPlans = sortedPlans.value.length; // Gunakan sortedPlans
    const currentTabIndex = activeIndex.value;
    if (diffX < 0) {
      activeIndex.value = (currentTabIndex + 1) % totalPlans;
    } else {
      activeIndex.value = (currentTabIndex - 1 + totalPlans) % totalPlans;
    }
  }
}

// Logika Modal & Checkout
const isModalOpen = ref(false);
const selectedPlan = ref(null);

function openModal(plan) {
  selectedPlan.value = plan;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedPlan.value = null;
  }, 300);
}

async function confirmCheckout() {
  if (!selectedPlan.value) return;

  try {
    await api.upgradeMembership(selectedPlan.value.id);
    alert(`Berhasil berlangganan paket ${selectedPlan.value.title}!`);
    closeModal();
    window.location.reload();
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      alert("Silakan login terlebih dahulu untuk berlangganan.");
    } else {
      alert("Gagal melakukan langganan. Silakan coba lagi.");
    }
    closeModal();
  }
}

onMounted(() => {
  fetchMemberships();
});
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

    <!-- Fallback Loading -->
    <div v-if="pricingPlans.length === 0" class="mt-20 text-gray-500 animate-pulse">
      Sedang memuat paket...
    </div>

    <!-- MOBILE VIEW (Slider) - Tetap pakai urutan asli atau sorted (opsional) -->
    <div v-else class="md:hidden mt-12">
      <div class="overflow-hidden">
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- Kita pakai sortedPlans agar urutan mobile juga konsisten (Biasa-Populer-Biasa) -->
          <div
            v-for="(plan, index) in sortedPlans"
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
          v-for="(plan, index) in sortedPlans"
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

    <!-- DESKTOP VIEW (Grid) - Menggunakan sortedPlans agar Populer di Tengah -->
    <div
      v-if="pricingPlans.length > 0"
      class="hidden md:flex items-center justify-center gap-6 mt-12 flex-wrap"
    >
      <PricingCard
        v-for="(plan, index) in sortedPlans"
        :key="index"
        :title="plan.title"
        :subtitle="plan.subtitle"
        :price="plan.price"
        :features="plan.features"
        :is-popular="plan.isPopular"
        class="md:w-[360px] transition-transform duration-300"
        :class="{ 
            'transform scale-110 z-10 shadow-2xl border-blue-500/30': plan.isPopular,
            'h-full': !plan.isPopular 
        }"
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
