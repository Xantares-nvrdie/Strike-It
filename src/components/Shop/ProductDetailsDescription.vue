<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
const activeTab = ref("deskripsi"); // default tab aktif

const setTab = (tabName) => {
    activeTab.value = tabName;
};

// Data penilaian (ulasan)
const reviesws = ref([
    {
        id: 1,
        username: "User1",
        rating: 1,
        date: "2024-06-15",
        comment: "Produk ini sangat bagus!",
    },
    {
        id: 2,
        username: "Bintang",
        rating: 4,
        date: "2024-06-10",
        comment: "Saya puas dengan pembelian ini.",
    },
    {
        id: 3,
        username: "Bintang Fajar",
        rating: 4,
        date: "2024-06-10",
        comment: "Saya puas dengan pembelian ini.",
    },
    {
        id: 4,
        username: "Bintang Putra",
        rating: 4,
        date: "2024-06-10",
        comment: "Saya puas dengan pembelian ini.",
    },
    {
        id: 5,
        username: "Iqbal",
        rating: 4,
        date: "2024-06-10",
        comment: "Saya puas dengan pembelian ini.",
    },
]);
</script>

<template>
    <section
        class="self-stretch p-6 bg-linear-131 from-white/20 to-gray-50/20 rounded-[37px] shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] outline outline-[2.50px] outline-offset-[-2.50px] outline-white backdrop-blur-sm flex flex-col justify-start items-center gap-8"
    >
        <!-- Tab Buttons -->
        <div
        role="tablist"
        class="flex flex-col items-center justify-center gap-8 sm:flex-row md:gap-14"
        >
        <!-- Tab 1: Deskripsi -->
        <button
            role="tab"
            :aria-selected="activeTab === 'deskripsi'"
            @click="setTab('deskripsi')"
            class="w-36 h-8 text-center text-xl font-outfit uppercase leading-8 transition-all duration-200"
            :class="activeTab === 'deskripsi'
            ? 'font-bold text-black border-b-2 border-black'
            : 'font-normal text-stone-500 hover:text-black hover:border-b hover:border-gray-400'"
        >
            DESKRIPSI
        </button>

        <!-- Tab 2: Penilaian -->
        <button
            role="tab"
            :aria-selected="activeTab === 'penilaian'"
            @click="setTab('penilaian')"
            class="w-36 h-8 text-center text-xl font-outfit uppercase leading-8 transition-all duration-200"
            :class="activeTab === 'penilaian'
            ? 'font-bold text-black border-b-2 border-black'
            : 'font-normal text-stone-500 hover:text-black hover:border-b hover:border-gray-400'"
        >
            PENILAIAN ({{ reviesws.length }})
        </button>
        </div>

        <!-- Content -->
        <div role="tabpanel" class="w-full">
            <!-- DESKRIPSI -->
            <div v-if="activeTab === 'deskripsi'">
                <p class="text-black text-base font-normal font-outfit leading-7">
                Oceanic Predator Pro adalah joran yang dirancang untuk performa dan
                keserbagunaan. Dibuat dengan blank carbon berkualitas tinggi yang
                ringan namun kuat, joran ini memberikan sensitivitas luar biasa untuk
                mendeteksi getaran umpan dan sambaran ikan terkecil sekalipun, serta
                kekuatan yang cukup untuk menaklukkan ikan predator.
                </p>

                <div
                class="flex flex-col md:flex-row items-start justify-start gap-5 mt-4"
                >
                <div class="flex-1 w-full">
                    <img
                    class="w-full h-auto shadow-md rounded-xl"
                    src="https://placehold.co/711x529"
                    alt="Gambar deskripsi 1"
                    />
                </div>

                <div class="flex-1 w-full">
                    <img
                    class="w-full h-auto shadow-md rounded-xl"
                    src="https://placehold.co/711x529"
                    alt="Gambar deskripsi 2"
                    />
                </div>
                </div>
            </div>

            <!-- PENILAIAN -->
            <div v-else-if="activeTab === 'penilaian'" class="w-full">
                <!-- Jika belum ada review -->
                <div
                    v-if="reviesws.length === 0"
                    class="text-center text-gray-600 text-lg font-outfit"
                >
                    Belum ada ulasan. Jadilah yang pertama memberikan penilaian!
                </div>
                <!-- Jika ada review -->
                <ul
                    v-else
                    class="flex flex-col divide-y divide-gray-200/50 w-full max-w-5xl mx-auto"
                >
                    <li
                        v-for="review in reviesws"
                        :key="review.id"
                        class="p-6 flex items-start gap-4 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]"
                    >
                        <div class="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full font-semibold text-gray-700">
                            {{ review.username.charAt(0).toUpperCase() }}
                        </div>

                        <div class="flex-1 text-left">

                        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h4 class="font-semibold text-gray-900">
                                    {{ review.username }}
                                </h4>
                                
                                <span class="text-sm text-gray-500">{{ review.date }}</span>
                            </div>
                            <div class="flex items-center text-yellow-500 absolute top-2 right-2">
                                <template v-for="i in 5" :key="i">
                                    <Icon
                                        v-if="i <= Math.floor(review.rating)"
                                        icon="mdi:star"
                                        class="w-5 h-5"
                                    />
                                    <Icon
                                        v-else-if="i - review.rating <= 0.5"
                                        icon="mdi:star-half-full"
                                        class="w-5 h-5"
                                    />
                                    <Icon
                                        v-else
                                        icon="mdi:star-outline"
                                        class="w-5 h-5"
                                    />
                                </template>
                            </div>
                            <div class="flex items-center gap-1 mt-1 sm:mt-0">
                                <span v-for="i in 5" :key="i" class="text-yellow-400">
                                    <i :class="i <= review.rating ? 'fas fa-star' : 'far fa-star'"
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <p class="mt-2 text-gray-800 font-outfit leading-7">
                            {{ review.comment }}
                        </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<style scoped></style>
