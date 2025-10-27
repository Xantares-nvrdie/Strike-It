<script setup>
import ProductCard from './ProductCard.vue';

defineProps({
    title: String,
    products: Array
});
</script>

<template>
    <section class="w-full p-5 bg-linear-131 from-white/20 to-gray-50/20 rounded-[37px] shadow-[5px_6px_22.899999618530273px_0px_rgba(0,0,0,0.13)] outline outline-[2.50px] outline-offset-[-2.50px] outline-white backdrop-blur-sm flex flex-col justify-start items-center gap-4">
        
        <div class="inline-flex items-start self-stretch justify-between">
            <h2 class="h-7 justify-start text-stone-800 text-2xl font-bold font-['Inter'] capitalize leading-7">
                {{ title }}
            </h2>
            <a href="#" class="flex items-center justify-start gap-2">
                <span class="text-right justify-center text-stone-800 text-sm font-semibold font-['Inter'] uppercase leading-5">Lihat semua</span>
                <i class="w-3 h-3.5 text-right justify-center text-stone-800 text-sm font-black font-['Font_Awesome_5_Pro'] uppercase leading-4"></i>
            </a>
        </div>
        
        <ul class="w-full p-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <li 
                v-for="product in products" 
                :key="product.id"
                class="flex flex-col items-center justify-start" 
                >
                <ProductCard :product="product" class="w-full" /> </li>
        </ul>
    </section>
</template>