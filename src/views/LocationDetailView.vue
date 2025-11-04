<script setup>
import LocationDetail from '../components/Booking/LocationDetail.vue';
import LocationHeader from '@/components/Booking/LocationHeader.vue';
</script>

<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        <LocationHeader class="w-full sticky top-[65px] z-40 py-4" />
        <LocationDetail class="w-full top-[65px] bg-zinc-100" />
    </div>
</template>


<style>
.font-outfit {
    font-family: "Outfit", sans-serif;
}
</style>
