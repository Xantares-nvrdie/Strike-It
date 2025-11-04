<template>
    <section
        id="diskon"
        class="min-h-screen/2 bg-white text-center pt-24 pb-16 font-['Outfit']"
    >
        <div class="px-4 header-diskon">
        <h2 class="text-4xl font-medium text-black md:text-6xl">Diskon Spesial</h2>
        <p class="max-w-xl mx-auto mt-5 text-base leading-relaxed text-gray-600">
            Lebih dari 1.300 orang telah menghemat lebih dari Rp.50.000.000 dengan
            kupon Strike It.
        </p>
        </div>

        <div
        class="flex flex-wrap justify-center gap-6 px-4 mt-12 container-card-diskon md:px-10"
        >
        <DiscountCard
            discount="15%"
            code="AASNAAD998"
            usage="122 dari 130 kupon sudah terpakai"
        />
        <DiscountCard
            discount="15%"
            code="ASD12229SDA"
            usage="122 dari 130 kupon sudah terpakai"
        />
        <DiscountCard
            discount="15%"
            code="ADAD9988"
            usage="122 dari 130 kupon sudah terpakai"
        />
        </div>
    </section>
</template>

<script setup>
import DiscountCard from "./DiscountCard.vue";
</script>
