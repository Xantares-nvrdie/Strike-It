<script setup>
import ProductDetails from '@/components/Shop/ProductDetails.vue';
import ShopHeader from '@/components/Shop/ShopHeader.vue';
import ProductDetailsDescription from '@/components/Shop/ProductDetailsDescription.vue';
</script>


<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        <ShopHeader class="w-full sticky top-[65px] z-40 bg-zinc-100 py-4 block" />
        <ProductDetails class="mt-20"/>
        <div class="p-5 md:p-10">
            <ProductDetailsDescription class="mt-10 mb-20 px-5 md:px-20"/>
        </div>
    </div>
</template>



<style scoped>

</style>
