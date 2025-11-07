<script setup>
import UserProfile from '@/components/Profile/UserProfile.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
</script>


<template>
    <div class="relative flex flex-row w-screen min-h-screen overflow-x-hidden bg-zinc-200">
            
            <Sidebar class="shrink-0" />
            
            <UserProfile class="ml-16 md:ml-64 flex-1" />
    </div>
</template>

<style scoped>

</style>
