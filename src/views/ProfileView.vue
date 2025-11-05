<script setup>
import UserProfile from '@/components/Profile/UserProfile.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
</script>


<template>
    <div class="relative flex flex-row w-full min-h-screen overflow-x-hidden bg-zinc-100">
            <Sidebar />
            <UserProfile class="flex-1 w-full mt-[65px] bg-red-700 py-4" />
    </div>
</template>



<style scoped>

</style>
