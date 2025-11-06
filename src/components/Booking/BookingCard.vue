<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const pricePerJam = 15000;
const duration = ref(2);

function increaseDuration() {
    duration.value++;
}

function decreaseDuration() {
    if (duration.value > 1) {
        duration.value--;
    }
}

const totalPrice = computed(() => {
    return (pricePerJam * duration.value).toLocaleString('id-ID');
});

const formattedPrice = pricePerJam.toLocaleString('id-ID');

const getToday = () => new Date().toISOString().split('T')[0];

const selectedDate = ref(getToday());

const formattedSelectedDate = computed(() => {
    if (!selectedDate.value) return 'Pilih tanggal';
    const date = new Date(selectedDate.value);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
});
</script>

<template>
    <div class="bg-[#eeeeee] border-white border-4 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
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
        <router-link to="/location/place/book">
            <button
                class="w-full bg-blue-600 text-white text-xl font-medium py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                Lanjutkan booking
            </button>
        </router-link>
    </div>
</template>
