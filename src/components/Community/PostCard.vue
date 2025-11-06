<script setup>
// Import Icon dari Iconify
import { Icon } from '@iconify/vue';
// 1. Import useRouter
import { useRouter } from 'vue-router';

const props = defineProps({
  post: Object,
});

// 2. Dapatkan instance router
const router = useRouter();

// 3. Buat fungsi untuk navigasi
function goToPost() {
  // Pastikan post.id ada sebelum mencoba navigasi
  if (props.post && props.post.id) {
    router.push(`/community/post/${props.post.id}`);
  }
}
</script>

<template>
  <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6 cursor-pointer" @click="goToPost">
    <div class="flex justify-between items-start">
      <div class="flex items-center space-x-3">
        <img class="h-10 w-10 rounded-full" :src="post.author.avatar" :alt="post.author.name">
        <div>
          <a href="#" class="text-sm font-semibold text-gray-900 hover:underline">{{ post.author.name }}</a>
          <p class="text-xs text-gray-500">{{ post.time }}</p>
        </div>
      </div>
      <button class="text-gray-400 hover:text-gray-600" @click.stop>
        <Icon icon="heroicons-solid:ellipsis-vertical" class="h-5 w-5" />
      </button>
    </div>

    <div class="mt-4">
      <h2 class="text-lg font-bold text-gray-900 cursor-pointer">
        {{ post.title }}
      </h2>
      <p class="mt-2 text-sm text-gray-700 line-clamp-3">
        {{ post.content }}
      </p>
    </div>

    <div
      class="mt-4 flex-wrap sm:flex md:flex-row justify-start sm:justify-start lg:justify-between items-center gap-4 m">
      <div class="flex flex-wrap gap-x-2 gap-y-2">
        <span v-for="tag in post.tags" :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 bg-[#e5e5e5] rounded-full text-xs font-medium text-gray-600">
          {{ tag }}
        </span>
      </div>
      <div class="flex space-x-4 text-sm text-gray-500 mt-4 sm:mt-0">
        <span class="flex items-center space-x-1">
          <Icon icon="heroicons-solid:eye" class="h-4 w-4" />
          <span>{{ post.stats.views }}</span>
        </span>
        <span class="flex items-center space-x-1">
          <Icon icon="heroicons-solid:chat-bubble-left-ellipsis" class="h-4 w-4" />
          <span>{{ post.stats.comments }}</span>
        </span>
        <span class="flex items-center space-x-1">
          <Icon icon="heroicons-solid:thumb-up" class="h-4 w-4" />
          <span>{{ post.stats.likes }}</span>
        </span>
      </div>
    </div>
  </div>
</template>