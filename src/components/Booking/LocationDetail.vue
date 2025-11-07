<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import BookingCard from '@/components/Booking/BookingCard.vue';
import LocationMapCard from '@/components/Booking/LocationMapCard.vue';
import ReviewCard from '@/components/Booking/ReviewCard.vue';
import avatarImg from '../../assets/saskeh.jpg';
import avatarImg2 from '../../assets/user.png';
const reviews = ref([
    {
        id: 1,
        username: 'CatLover92',
        avatarUrl: avatarImg,
        date: '22 Jul',
        isCurrentUser: false,
        rating: 5,
        comment: 'Tempat mancing terbaik sejauh ini!...'
    },
    {
        id: 2,
        username: 'PetParent7',
        avatarUrl: avatarImg2,
        date: '22 Jul',
        isCurrentUser: false,
        rating: 4,
        comment: 'Saya baru pertama kali mancing di sini...'
    },
]);


const activeTab = ref('about');
const isBookingModalOpen = ref(false);
const tabs = ['about', 'location', 'review'];
const tabContentRef = ref(null);

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

    const threshold = 50;

    const currentTabIndex = tabs.indexOf(activeTab.value);

    if (Math.abs(diffX) > threshold) {
        if (diffX < 0) {
            const nextIndex = (currentTabIndex + 1) % tabs.length;
            activeTab.value = tabs[nextIndex];
        } else {
            const prevIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
            activeTab.value = tabs[prevIndex];
        }
    }
}
</script>

<template>
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 w-full bg-zinc-100 rounded-3xl shadow-xl p-4 md:p-8 lg:p-12 flex flex-col gap-8">

            <div class="text-center mb-0 md:mb-4">
                <h1 class="text-4xl font-medium text-[#1e2f42] md:text-6xl">
                    STRIKE IT!
                </h1>
                <p class="max-w-2xl mx-auto mt-1 text-lg leading-relaxed text-gray-600">
                    Cabang Tempat
                </p>
            </div>

            <div class="hidden md:flex flex-col gap-8">
                <div class="flex flex-col gap-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <img src="../../assets/locationimg/jakarta.jpg" alt="Main Location"
                            class="w-full h-auto object-cover rounded-2xl shadow-lg col-span-2">
                        <img src="../../assets/locationimg/jakarta.jpg" alt="Thumbnail 1"
                            class="w-full h-auto object-cover rounded-2xl shadow-lg">
                        <img src="../../assets/locationimg/jakarta.jpg" alt="Thumbnail 2"
                            class="w-full h-auto object-cover rounded-2xl shadow-lg">
                    </div>
                    <div class="bg-[#eeeeee] border-white border-4 rounded-2xl shadow-xl p-6 md:p-8">
                        <h3 class="text-3xl font-medium text-center text-gray-900 mb-4">
                            Tentang tempat ini
                        </h3>
                        <div class="space-y-4 text-gray-700 leading-relaxed text-justify">
                            <p>Memancing minimalis adalah sub-genre dari aktivitas memancing itu sendiri. Aktivitas ini
                                dicirikan oleh estetika yang lebih sederhana dan memanfaatkan penggunaan pengulangan
                                serta pengembangan yang tidak berlebihan. Memancing minimalis diperkirakan pertama kali
                                dikembangkan pada awal 1990-an oleh pemancing dari Detroit, Robert "Hood" dan Daniel
                                "Bell."</p>
                            <p>Tren ini melihat berakhirnya teknik memancing yang berlebihan yang menjadi ciri khas gaya
                                Detroit yang asli. Robert Hood mencatat bahwa ia dan Daniel Bell menyadari ada sesuatu
                                yang hilang dari memancing di era pasca-kompetisi.</p>
                        </div>
                    </div>
                    <div class="bg-zinc-100 border-white border-4 rounded-2xl shadow-xl p-6 md:p-8">
                        <h3 class="text-3xl font-medium text-center text-gray-900 mb-6">
                            Penilaian Tempat
                        </h3>
                        <div class="flex flex-col gap-6">
                            <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
                        </div>
                    </div>
                </div>
                </div>

            <div class="block md:hidden space-y-4">
                <div class="relative w-full">
                    <img src="../../assets/locationimg/jakarta.jpg" alt="Main Location"
                        class="w-full h-auto object-cover rounded-2xl shadow-lg">
                    <div class="absolute inset-0 flex justify-between items-center px-2">
                        <button class="bg-white/70 rounded-full p-1 text-black shadow-md">
                            <Icon icon="mdi:chevron-left" class="size-6" />
                        </button>
                        <button class="bg-white/70 rounded-full p-1 text-black shadow-md">
                            <Icon icon="mdi:chevron-right" class="size-6" />
                        </button>
                    </div>
                </div>

                <button @click="isBookingModalOpen = true"
                    class="w-full bg-blue-600 text-white text-xl font-medium py-4 rounded-xl shadow-lg my-4">
                    Book sekarang
                </button>

                <div class="flex justify-center gap-2 py-2">
                    <button @click="activeTab = 'about'" :class="activeTab === 'about' ? 'bg-blue-600' : 'bg-gray-300'"
                        class="size-3 rounded-full transition-colors"></button>
                    <button @click="activeTab = 'location'"
                        :class="activeTab === 'location' ? 'bg-blue-600' : 'bg-gray-300'"
                        class="size-3 rounded-full transition-colors"></button>
                    <button @click="activeTab = 'review'"
                        :class="activeTab === 'review' ? 'bg-blue-600' : 'bg-gray-300'"
                        class="size-3 rounded-full transition-colors"></button>
                </div>


                <div ref="tabContentRef" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
                    <div class="bg-[#eeeeee] border-4 border-white rounded-2xl shadow-xl p-6">
                        <div v-if="activeTab === 'about'">
                            <h3 class="text-2xl font-medium text-center text-gray-900 mb-4">Tentang tempat ini</h3>
                            <div class="space-y-4 text-gray-700 leading-relaxed text-justify">
                                <p>Memancing minimalis adalah sub-genre dari aktivitas memancing itu sendiri. Aktivitas
                                    ini dicirikan oleh estetika yang lebih sederhana dan memanfaatkan penggunaan
                                    pengulangan serta pengembangan yang tidak berlebihan. Memancing minimalis
                                    diperkirakan pertama kali dikembangkan pada awal 1990-an oleh pemancing dari
                                    Detroit, Robert "Hood" dan Daniel "Bell."</p>
                                <p>Tren ini melihat peningkatan minat dalam teknik memancing yang lebih sederhana dan
                                    lebih terfokus pada pengalaman daripada peralatan yang mahal.</p>
                            </div>
                        </div>

                        <div v-if="activeTab === 'location'">
                            <LocationMapCard />
                        </div>

                        <div v-if="activeTab === 'review'">
                            <h3 class="text-2xl font-medium text-center text-gray-900 mb-4">Rating & Review</h3>
                            <div class="flex flex-col gap-4">
                                <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="hidden lg:block lg:col-span-1">
            <div class="sticky top-8 flex flex-col gap-8">
                <BookingCard />
                <LocationMapCard />
            </div>
        </div>


        <div v-if="isBookingModalOpen" @click="isBookingModalOpen = false"
            class="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div @click.stop class="relative bg-white rounded-2xl p-4 pt-10 shadow-xl w-full max-w-md">
                <button @click="isBookingModalOpen = false"
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                    <Icon icon="mdi:close" class="size-7" />
                </button>
                <BookingCard />
            </div>
        </div>

    </main>
</template>
