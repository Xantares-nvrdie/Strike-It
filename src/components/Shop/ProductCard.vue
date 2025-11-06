<script setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

defineProps({
    product: Object // Berisi { id, imageUrl, name, rating, sold, price, ... }
});

const isLoved = ref(false);

function toggleLove() {
    isLoved.value = !isLoved.value;
}

</script>

<template>
    <router-link to="/details" class="block w-full sm:pointer-events-none">
        <article class="bg-white/30 backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22.9px_rgba(0,0,0,0.13)] 
                   outline outline-[2.5px] outline-offset-[-2.5px] outline-white 
                   flex flex-col items-center text-start hover:scale-105 hover:shadow-lg p-5 w-full gap-1 lg:gap-3">
            <img :src="product.imageUrl" :alt="product.name" class="object-cover w-full h-26 sm:h-48 rounded-2xl" />

            <h3 class="mt-2 text-sm sm:text-center font-semibold leading-tight text-stone-900 font-outfit min-h-10">
                {{ product.name }}
            </h3>

            <div class="flex flex-col items-center justify-center mt-1 space-y-1">

                <div class="flex items-center justify-center gap-1 text-amber-400">
                    <i v-for="n in product.rating" :key="'full-' + n" class="text-sm fas fa-star"></i>
                    <i v-for="n in (5 - product.rating)" :key="'empty-' + n"
                        class="text-sm text-gray-300 far fa-star"></i>
                </div>

                <span class="text-xs text-gray-500">{{ product.sold }} terjual</span>
            </div>

            <p class="mt-1 text-lg font-semibold text-stone-800">
                {{ product.price }}
            </p>

            <div class="flex items-center justify-center gap-3 mt-1 h-7">
                <span v-if="product.isForRent"
                    class="px-3 py-1 text-[10px] font-semibold text-green-700 uppercase bg-green-100 rounded-md">
                    Sewa
                </span>
                <span v-if="product.isForSale"
                    class="px-3 py-1 text-[10px] font-semibold text-red-700 uppercase bg-red-100 rounded-md">
                    Beli
                </span>
            </div>

            <div class="flex flex-col items-center justify-center w-full space-y-0 sm:space-y-2">

                <router-link to="/details" class="w-[85%] hidden sm:block sm:pointer-events-auto">
                    <button type="button" class="w-full px-3 py-2 text-sm font-medium text-white transition bg-gradient-to-tr 
                               from-blue-800 to-blue-500/90 rounded-lg font-outfit 
                               hover:from-blue-700 hover:to-blue-400">
                        Lihat
                    </button>
                </router-link>

                <button type="button" class="tra    nsition rounded-xl hover:text-red-500 sm:pointer-events-auto"
                    :class="isLoved ? 'text-red-500' : 'text-gray-500'" aria-label="Tambah ke Suka"
                    @click.prevent.stop="toggleLove">
                    <Icon v-if="!isLoved" icon="line-md:heart" width="24" height="24" />
                    <Icon v-else icon="line-md:heart-filled" width="24" height="24" />
                </button>
            </div>
        </article>
    </router-link>
</template>
