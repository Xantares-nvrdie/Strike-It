<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Terima props dari parent (Logic Integrasi Tetap Ada)
const props = defineProps({
    price: { type: Number, default: 15000 },
    locationId: { type: Number, required: true }
});

const router = useRouter();
const duration = ref(2);

// Fungsi durasi
function increaseDuration() { duration.value++; }
function decreaseDuration() { if (duration.value > 1) duration.value--; }

const totalPrice = computed(() => (props.price * duration.value).toLocaleString('id-ID'));
const formattedPrice = computed(() => props.price.toLocaleString('id-ID'));

// Date logic
const getToday = () => new Date().toISOString().split('T')[0];
const selectedDate = ref(getToday());

// Fungsi Lanjut Booking
const handleBooking = () => {
    router.push({
        path: `/location/${props.locationId}/book`,
        query: {
            date: selectedDate.value,
            duration: duration.value
        }
    });
};
</script>

<template>
    <div class="bg-zinc-100 border-white border-4 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <h3 class="text-3xl font-medium text-center text-gray-900">
            Mulai Booking
        </h3>

        <div>
            <span class="text-4xl font-bold text-blue-600">Rp. {{ formattedPrice }}</span>
            <span class="text-xl text-gray-500">/jam</span>
        </div>

        <div class="space-y-3">
            <label class="font-medium text-gray-700">Berapa lama anda akan memancing?</label>
            <div class="flex justify-between items-center bg-gray-100 rounded-lg p-2">
                <button @click="decreaseDuration"
                    class="size-10 bg-red-500 text-white rounded-full text-2xl font-bold disabled:bg-gray-300"
                    :disabled="duration <= 1">
                    -
                </button>
                <span class="text-xl font-bold text-gray-900">{{ duration }} jam</span>
                <button @click="increaseDuration"
                    class="size-10 bg-green-500 text-white rounded-full text-2xl font-bold">
                    +
                </button>
            </div>
        </div>

        <div class="space-y-3">
            <label for="date-picker" class="font-medium text-gray-700">Pilih Tanggal</label>
            <input id="date-picker" type="date" v-model="selectedDate" :min="getToday()"
                class="w-full bg-gray-100 rounded-lg p-3 text-lg font-medium text-gray-900 border-none outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="text-center">
            <p class="text-gray-600">
                Anda akan membayar
                <span class="font-bold text-blue-600">Rp. {{ totalPrice }}</span>
                untuk {{ duration }} jam
            </p>
        </div>
        
        <button
            @click="handleBooking"
            class="w-full bg-blue-600 text-white text-xl font-medium py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
            Lanjutkan booking
        </button>
    </div>
</template>
