<script setup>
defineProps({
  product: Object // Berisi { id, imageUrl, name, rating, sold, price, ... }
});
</script>

<template>
    <article 
        class="bg-white/30 backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22.9px_rgba(0,0,0,0.13)] 
            outline outline-[2.5px] outline-offset-[-2.5px] outline-white 
            flex flex-col items-center text-center p-5 w-full gap-3 
            transition-transform hover:scale-105 hover:shadow-lg"
    >
        <img 
        :src="product.imageUrl" 
        :alt="product.name"
        class="object-cover w-full h-48 rounded-2xl"
        />

        <h3 class="mt-2 text-sm font-semibold leading-tight text-stone-900 font-outfit h-10">
        {{ product.name }}
        </h3>

        <div class="flex flex-col items-center justify-center mt-1 space-y-1">
        
        <div class="flex items-center justify-center gap-1 text-amber-400">
            <i 
            v-for="n in product.rating" 
            :key="'full-' + n" 
            class="text-sm fas fa-star"
            ></i>
            
            <i 
            v-for="n in (5 - product.rating)" 
            :key="'empty-' + n" 
            class="text-sm text-gray-300 far fa-star"
            ></i>
        </div>
        
        <span class="text-xs text-gray-500">{{ product.sold }} terjual</span>
        </div>
        
        <p class="mt-1 text-lg font-semibold text-stone-800">
        {{ product.price }}
        </p>

    <div class="flex items-center justify-center gap-3 mt-1 h-7">
        <span v-if="product.isForRent" class="px-3 py-1 text-[10px] font-semibold text-green-700 uppercase bg-green-100 rounded-md">
            Sewa
        </span>
        <span v-if="product.isForSale" class="px-3 py-1 text-[10px] font-semibold text-red-700 uppercase bg-red-100 rounded-md">
            Beli
        </span>
    </div>

        <div class="flex flex-col items-center justify-center w-full mt-4 space-y-2">
        <button 
            type="button"
            class="w-[85%] px-3 py-2 text-sm font-medium text-white transition bg-gradient-to-tr 
                from-blue-800 to-blue-500/90 rounded-lg font-outfit 
                hover:from-blue-700 hover:to-blue-400"
        >
            Tambah ke Keranjang
        </button>
        <button 
            type="button"
            class="p-2 text-gray-500 transition bg-white/40 rounded-xl hover:text-red-500"
            aria-label="Tambah ke wishlist"
        >
            <i class="text-lg fas fa-heart"></i>
        </button>
        </div>
    </article>
</template>
