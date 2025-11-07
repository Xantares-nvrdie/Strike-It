<script setup>
import Sidebar from "@/components/Layout/Sidebar.vue";
import CommunityFeed from "@/components/Community/CommunityFeed.vue";
</script>

<template>
  <div class="relative flex flex-row w-screen min-h-screen bg-zinc-100">
    <Sidebar class="shrink-0" />
    <CommunityFeed class="ml-16 md:ml-64 flex-1 py-[65px]" />
  </div>
</template>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
