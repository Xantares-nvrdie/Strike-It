<script setup>
import BookingPage from '@/components/Booking/BookingPage.vue';
import LocationHeader from '@/components/Booking/LocationHeader.vue';
</script>

<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        <LocationHeader class="w-full sticky top-[65px] z-40 bg-zinc-100 py-4" />
        <BookingPage class="py-[100px] pt-[100px] mb-[100px]" />
    </div>
</template>


<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
