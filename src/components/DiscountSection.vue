<template>
    <section class="min-h-screen bg-white text-center pt-24 pb-16">
    <div class="header-diskon px-4">
        <h2 class="text-4xl md:text-5xl font-medium text-black">Diskon Spesial</h2>
        <p class="mt-5 text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
        Lebih dari 1.300 orang telah menghemat lebih dari Rp.50.000.000 dengan kupon Strike It.
        </p>
    </div>

    <div class="container-card-diskon flex flex-wrap justify-center gap-6 mt-12 px-4 md:px-10">
        <DiscountCard discount="15%" code="BINTANGGANTENG" usage="122 dari 130 kupon sudah terpakai" />
        <DiscountCard discount="15%" code="BINTANGGANTENG" usage="122 dari 130 kupon sudah terpakai" />
        <DiscountCard discount="15%" code="BINTANGGANTENG" usage="122 dari 130 kupon sudah terpakai" />
    </div>
    </section>
</template>

<script setup>
import DiscountCard from './DiscountCard.vue';
</script>