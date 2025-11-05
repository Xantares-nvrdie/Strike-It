<script setup>
import CommunityHeader from '@/components/Community/CommunityHeader.vue';
import CreatePost from '@/components/Community/CreatePost.vue';
</script>

<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        <CommunityHeader class="w-full sticky top-[65px] z-40 bg-zinc-100 py-4" />
        <CreatePost class="py-[100px] pt-[100px] mb-[100px]" />
    </div>
</template>


<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
