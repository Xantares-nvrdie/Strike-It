<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import api from "@/services/api.js";
import { useToast } from "vue-toastification";

// Menerima data 'post' dari parent (CommunityFeed)
const props = defineProps({
  post: Object,
});

const router = useRouter();
const toast = useToast();

// State Lokal untuk Like (Optimistic UI Update)
const isLiked = ref(false); // Default belum dilike (bisa diupdate logicnya nanti cek dari DB)
const likeCount = ref(props.post.stats.likes); // Jumlah like awal

// Navigasi ke halaman detail postingan
function goToPost() {
  if (props.post && props.post.id) {
    router.push(`/community/post/${props.post.id}`);
  }
}

// Handle Like Post
const handleLike = async (event) => {
  // event.stopPropagation() mencegah klik tembus ke card
  // agar tidak pindah ke halaman detail saat tombol like diklik.
  event.stopPropagation();

  try {
    // Panggil API toggle like
    const response = await api.toggleLikePost(props.post.id);

    // Update UI berdasarkan respons backend
    if (response.data.liked) {
      likeCount.value++;
      isLiked.value = true;
    } else {
      likeCount.value--;
      isLiked.value = false;
    }
  } catch (error) {
    // Handle jika user belum login (401)
    toast.warning("Silakan login untuk menyukai postingan.");
  }
};
</script>

<template>
  <div
    class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6 cursor-pointer transition-transform hover:scale-[1.01]"
    @click="goToPost"
  >
    <div class="flex justify-between items-start">
      <div class="flex items-center space-x-3">
        <img
          class="h-10 w-10 rounded-full object-cover"
          :src="post.author.avatar"
          :alt="post.author.name"
          @error="
            $event.target.src =
              'https://ui-avatars.com/api/?name=' + post.author.name
          "
        />
        <div>
          <span class="text-sm font-semibold text-gray-900 hover:underline">{{
            post.author.name
          }}</span>
          <p class="text-xs text-gray-500">{{ post.time }}</p>
        </div>
      </div>
      <button class="text-gray-400 hover:text-gray-600" @click.stop>
        <Icon icon="heroicons-solid:ellipsis-vertical" class="h-5 w-5" />
      </button>
    </div>

    <div class="mt-4">
      <h2 class="text-lg font-bold text-gray-900">
        {{ post.title }}
      </h2>
      <p class="mt-2 text-sm text-gray-700 line-clamp-3">
        {{ post.content }}
      </p>
    </div>

    <div class="mt-4 flex flex-wrap justify-between items-center gap-4">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 bg-[#e5e5e5] rounded-full text-xs font-medium text-gray-600 capitalize"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex space-x-4 text-sm text-gray-500">
        <span class="flex items-center space-x-1">
          <Icon icon="heroicons-solid:eye" class="h-4 w-4" />
          <span>{{ post.stats.views }}</span>
        </span>
        <span class="flex items-center space-x-1">
          <Icon
            icon="heroicons-solid:chat-bubble-left-ellipsis"
            class="h-4 w-4"
          />
          <span>{{ post.stats.comments }}</span>
        </span>

        <button
          @click="handleLike"
          class="flex items-center space-x-1 transition-colors z-10"
          :class="isLiked ? 'text-blue-600 font-bold' : 'hover:text-blue-600'"
        >
          <Icon
            :icon="
              isLiked
                ? 'heroicons-solid:thumb-up'
                : 'heroicons-outline:thumb-up'
            "
            class="h-4 w-4"
          />
          <span>{{ likeCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
