<script setup>
import Sidebar from "@/components/Layout/Sidebar.vue";
import CreatePost from "@/components/Community/CreatePost.vue";
</script>

<template>
  <div class="relative flex flex-row w-screen min-h-screen bg-zinc-100">
    <Sidebar class="shrink-0" />
    <CreatePost class="ml-16 md:ml-64 flex-1" />
  </div>
</template>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
