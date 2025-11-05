<script setup>
import UserProfile from '@/components/Profile/UserProfile.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import Footer from '@/components/Layout/Footer.vue';
</script>


<template>
    <div class="relative flex flex-row w-screen min-h-screen bg-zinc-100">
            <Sidebar class="shrink-0" />
            <UserProfile class="flex-1" />
    </div>
    </template>



<style scoped>

</style>
