<script setup>
import { ref, onMounted, computed } from "vue";
import PricingCard from "./PricingCard.vue";
import { Icon } from "@iconify/vue";
import api from "@/services/api"; // Import API Service

// --- State Management ---
const pricingPlans = ref([]);
const isModalOpen = ref(false);
const selectedPlan = ref(null); // Paket yang dipilih user untuk dibeli
const isLoggedIn = ref(false);
const userMembership = ref(""); // Nama paket user saat ini (misal: 'Premium')

// --- Fetch Data Logic ---
const fetchAllData = async () => {
  try {
    // Cek Login & Ambil Paket Aktif User
    const token = localStorage.getItem("token");
    if (token) {
      isLoggedIn.value = true;
      try {
        const profileRes = await api.getMyProfile();
        userMembership.value = profileRes.data.membership_name;
      } catch (e) {
        console.warn("Token expired/invalid", e);
        isLoggedIn.value = false;
      }
    }

    // Ambil List Paket dari Backend
    const response = await api.getMemberships();

    // Mapping data DB ke format Frontend
    pricingPlans.value = response.data.map((plan) => ({
      id: plan.id,
      title: plan.name,
      subtitle: plan.description,
      // Format harga langsung di sini
      price: Number(plan.price_per_month).toLocaleString("id-ID"),
      features: plan.benefits
        ? plan.benefits.split(/[\n,]/).filter((f) => f.trim())
        : [],
      isPopular: Boolean(plan.is_popular),
    }));
  } catch (error) {
    console.error("Gagal memuat data:", error);
  }
};

// Logic Sorting: Meletakkan paket 'Popular' di tengah agar menonjol
const sortedPlans = computed(() => {
  if (pricingPlans.value.length === 0) return [];

  const popular = pricingPlans.value.find((p) => p.isPopular);
  const regular = pricingPlans.value.filter((p) => !p.isPopular);

  // Jika ada paket populer dan total >= 2, susun ulang array
  if (popular && regular.length >= 2) {
    return [regular[0], popular, regular[1], ...regular.slice(2)];
  }

  return pricingPlans.value;
});

// Logika Slider Mobile
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

  if (Math.abs(diffY) > Math.abs(diffX)) return; // Abaikan scroll vertikal

  const tapThreshold = 10;
  const swipeThreshold = 50;

  if (Math.abs(diffX) < tapThreshold && Math.abs(diffY) < tapThreshold) return;

  if (Math.abs(diffX) > swipeThreshold) {
    e.preventDefault();
    const totalPlans = sortedPlans.value.length;
    const currentTabIndex = activeIndex.value;
    if (diffX < 0) {
      activeIndex.value = (currentTabIndex + 1) % totalPlans;
    } else {
      activeIndex.value = (currentTabIndex - 1 + totalPlans) % totalPlans;
    }
  }
}

// Logika Modal & Checkout
function openModal(plan) {
  // Jika belum login, arahkan ke login page
  if (!isLoggedIn.value) {
    if (confirm("Silakan login terlebih dahulu untuk berlangganan.")) {
      window.location.href = "/login";
    }
    return;
  }
  selectedPlan.value = plan;
  isModalOpen.value = true; // Buka modal
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

    // Tutup modal
    isModalOpen.value = false;

    alert(
      `Pembayaran Berhasil! Anda sekarang berlangganan paket ${selectedPlan.value.title}.`
    );

    // Refresh data agar status membership terupdate
    await fetchAllData();
  } catch (error) {
    console.error(error);
    alert("Gagal melakukan pembayaran. Silakan coba lagi.");
  }
}

// Helper: Cek apakah plan ini adalah plan user saat ini
const isCurrentPlan = (planName) => {
  return isLoggedIn.value && planName === userMembership.value;
};

onMounted(() => {
  fetchAllData();
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

    <div
      v-if="pricingPlans.length === 0"
      class="mt-20 text-gray-500 animate-pulse"
    >
      Sedang memuat paket...
    </div>

    <div v-else class="md:hidden mt-12">
      <div class="overflow-hidden">
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
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
              :is-current="isCurrentPlan(plan.title)"
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
          :class="activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'"
          class="size-3 rounded-full transition-colors"
          :aria-label="`Go to plan ${index + 1}`"
        ></button>
      </div>
    </div>

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
        :is-current="isCurrentPlan(plan.title)"
        class="md:w-[360px] transition-transform duration-300"
        :class="{
          'transform scale-110 z-10 shadow-2xl border-blue-500/30':
            plan.isPopular && !isCurrentPlan(plan.title),
          'h-full': !plan.isPopular,
        }"
        @subscribe="openModal(plan)"
      />
    </div>
  </section>

  <Transition name="fade">
    <div
      v-if="isModalOpen && selectedPlan"
      @click="closeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm font-['Outfit']"
    >
      <div
        @click.stop
        class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative transform transition-all scale-100"
      >
        <div class="text-center mb-6">
          <div
            class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon
              icon="mdi:credit-card-outline"
              class="w-8 h-8 text-blue-600"
            />
          </div>
          <h3 class="text-2xl font-bold text-gray-900">
            Konfirmasi Pembayaran
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            Simulasi pembayaran langganan
          </p>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Paket</span>
            <span class="font-bold text-gray-900">{{
              selectedPlan.title
            }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Metode Bayar</span>
            <span class="text-sm font-medium text-blue-600"
              >E-Wallet (Simulasi)</span
            >
          </div>
          <div class="border-t border-gray-200 my-2"></div>
          <div class="flex justify-between items-center">
            <span class="text-base font-bold text-gray-800">Total</span>
            <span class="text-xl font-bold text-blue-600"
              >Rp {{ selectedPlan.price }}</span
            >
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="closeModal"
            class="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition duration-200"
          >
            Batal
          </button>
          <button
            @click="confirmCheckout"
            class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition duration-300 active:scale-95"
          >
            Bayar / Oke
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
