<script setup>
import { Icon } from "@iconify/vue";

// defineProps & defineEmits tidak perlu di-import di <script setup>
const props = defineProps({
  item: { type: Object, required: true },
});

const emit = defineEmits(["toggle-rating", "submit-rating"]);

// Helper warna status
const getStatusClass = (status) => {
  switch (status) {
    case "terbayar":
      return "text-green-600 bg-green-50 px-2 py-1 rounded";
    case "belum_dibayar":
      return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
    case "dibatalkan":
      return "text-red-600 bg-red-50 px-2 py-1 rounded";
    default:
      return "text-gray-500 bg-gray-50 px-2 py-1 rounded";
  }
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow p-6 transition-all duration-300 border border-gray-100 hover:shadow-md"
  >
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-gray-900 line-clamp-2">
          {{ props.item.title }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">{{ props.item.dateTime }}</p>
      </div>
      <div class="flex-shrink-0 text-left sm:text-right">
        <p class="text-lg font-bold text-gray-900">{{ props.item.price }}</p>
        <span
          class="text-xs font-medium mt-1 inline-block"
          :class="getStatusClass(props.item.status)"
        >
          {{ props.item.statusText }}
        </span>
      </div>
    </div>

    <div class="mt-4 border-t border-gray-100 pt-4 flex justify-end">
      <div
        v-if="props.item.hasReviewed"
        class="flex items-center text-sm font-medium gap-1"
      >
        <template v-if="props.item.type === 'booking'">
          <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-600" />
          <span class="text-green-600">Ulasan Terkirim</span>
        </template>

        <template v-else>
          <span class="text-gray-500">Transaksi Selesai</span>
        </template>
      </div>

      <button
        v-else
        @click="emit('toggle-rating')"
        class="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
      >
        <Icon
          :icon="
            props.item.isRatingVisible ? 'mdi:chevron-up' : 'mdi:star-outline'
          "
          class="w-4 h-4"
        />
        {{ props.item.isRatingVisible ? "Tutup" : "Beri Ulasan" }}
      </button>
    </div>

    <div
      v-if="props.item.isRatingVisible"
      class="mt-4 pt-4 border-t border-dashed border-gray-200 animate-fade-in"
    >
      <div class="flex flex-col gap-3">
        <p class="text-sm font-medium text-gray-700">
          Bagaimana pengalaman Anda?
        </p>

        <div class="flex items-center gap-1">
          <button
            v-for="star in 5"
            :key="star"
            @click="props.item.rating = star"
            class="focus:outline-none transition-transform active:scale-90"
          >
            <Icon
              :icon="
                star <= props.item.rating ? 'mdi:star' : 'mdi:star-outline'
              "
              class="w-8 h-8 transition-colors"
              :class="
                star <= props.item.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              "
            />
          </button>
        </div>

        <textarea
          v-model="props.item.reviewText"
          rows="3"
          placeholder="Ceritakan pengalaman Anda..."
          class="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white"
        ></textarea>

        <div class="flex justify-end">
          <button
            @click="emit('submit-rating')"
            class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Kirim Ulasan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
