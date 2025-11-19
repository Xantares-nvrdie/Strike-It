<script setup>
import Sidebar from "@/components/Layout/Sidebar.vue";
import PostDetail from "@/components/Community/PostDetail.vue";
</script>

<template>
  <div class="relative flex flex-row w-screen min-h-screen bg-zinc-100">
    <Sidebar class="shrink-0" />
    <PostDetail class="ml-16 md:ml-64 flex-1 py-[64px]" />
  </div>
</template>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
