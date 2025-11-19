<script setup>
import ProductDetails from '@/components/Shop/ProductDetails.vue';
import ProductDetailsDescription from '@/components/Shop/ProductDetailsDescription.vue';
</script>


<template>
    <div class="relative w-screen min-h-screen overflow-x-hidden bg-zinc-100">
        <ProductDetails class="mt-10"/>
        <div class="p-5 md:p-10">
            <ProductDetailsDescription class="mt-10 mb-20 px-5 md:px-20"/>
        </div>
    </div>
</template>



<style scoped>

</style>
