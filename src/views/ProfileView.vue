<script setup>
import UserProfile from '@/components/Profile/UserProfile.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Footer from '@/components/Layout/Footer.vue';
</script>


<template>
    <div class="relative flex flex-row w-full min-h-screen overflow-x-hidden bg-zinc-100">
            <Sidebar class="z-30 shrink-0" />
            <UserProfile class="flex-1 w-full" />
    </div>
    <!-- <Footer /> -->
</template>



<style scoped>

</style>
