<script setup>
import { ref } from 'vue';
import ProductDetails from '@/components/Shop/ProductDetails.vue';
import ShopHeader from '@/components/Shop/ShopHeader.vue';
</script>


<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        <ShopHeader class="w-full sticky top-[65px] z-40 bg-zinc-100 py-4 block" />
        <ProductDetails class="mt-20"/>
    </div>
</template>



<style scoped>

</style>
