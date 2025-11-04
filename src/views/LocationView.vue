<script setup>
import LocationListPage from '../components/Booking/LocationListPage.vue';
import LocationHeader from '@/components/Booking/LocationHeader.vue';
</script>

<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        <LocationHeader class="w-full sticky top-[65px] z-40 bg-zinc-100 py-4" />
        <LocationListPage />
    </div>
</template>


<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
