<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // Untuk ambil ID dari URL
import CommentCard from "@/components/Community/CommentCard.vue";
import { Icon } from "@iconify/vue";
import api from "@/services/api.js";
import { useToast } from "vue-toastification";

const route = useRoute();
const toast = useToast();
const baseUrl = "http://localhost:3000/uploads";

// Data State
const post = ref(null);
const comments = ref([]);
const newComment = ref("");
const isLoading = ref(true);

// Helper Time Ago (Sama seperti di feed)
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 3600;
  if (interval > 24) return Math.floor(interval / 24) + " hari lalu";
  return Math.floor(interval) + " jam lalu";
};

// Fetch Data Detail Post & Komentar
const loadData = async () => {
  const postId = route.params.id; // Ambil ID dari URL
  try {
    // 1. Fetch Post Detail
    const postRes = await api.getPostDetail(postId);
    const p = postRes.data;
    // Format data post
    post.value = {
      ...p,
      author: {
        name: p.author_name,
        avatar: p.author_avatar
          ? p.author_avatar.startsWith("http")
            ? p.author_avatar
            : `${baseUrl}/${p.author_avatar}`
          : `https://ui-avatars.com/api/?name=${p.author_name}`,
      },
    };

    // 2. Fetch Comments untuk post ini
    const commentsRes = await api.getPostComments(postId);
    // Map data komentar
    comments.value = commentsRes.data.map((c) => ({
      id: c.id,
      author: {
        name: c.author_name,
        avatar: c.author_avatar
          ? c.author_avatar.startsWith("http")
            ? c.author_avatar
            : `${baseUrl}/${c.author_avatar}`
          : `https://ui-avatars.com/api/?name=${c.author_name}`,
      },
      time: timeAgo(c.created_at),
      content: c.content,
    }));
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat postingan");
  } finally {
    isLoading.value = false;
  }
};

// Logic Submit Komentar Baru
const submitComment = async () => {
  if (!newComment.value.trim()) return; // Validasi input kosong

  try {
    await api.createComment(route.params.id, { content: newComment.value });
    toast.success("Komentar terkirim");
    newComment.value = ""; // Reset text area
    loadData(); // Refresh data komentar agar muncul yang baru
  } catch (error) {
    toast.error("Gagal mengirim komentar");
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" v-if="post">
      <div
        class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6 sm:p-8"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-3">
            <img
              class="h-10 w-10 rounded-full"
              :src="post.author.avatar"
              :alt="post.author.name"
            />
            <div>
              <a
                href="#"
                class="text-sm font-semibold text-gray-900 hover:underline"
                >@{{ post.author.name }}</a
              >
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <Icon icon="heroicons-solid:ellipsis-vertical" class="h-5 w-5" />
          </button>
        </div>

        <article class="mt-6 text-black prose prose-sm max-w-none">
          <h2>{{ post.title }}</h2>
          <p class="whitespace-pre-line">{{ post.body }}</p>
        </article>

        <div class="mt-6 flex justify-between items-center">
          <div class="flex space-x-2">
            <span
              class="inline-flex items-center px-2.5 py-0.5 bg-[#e5e5e5] rounded-full text-xs font-medium text-gray-600"
            >
              {{ post.category }}
            </span>
          </div>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
          >
            <Icon icon="heroicons-solid:plus" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-lg text-center font-bold text-gray-900 mb-6">
          Balasan
        </h2>

        <div
          class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-5 mb-6"
        >
          <textarea
            v-model="newComment"
            rows="3"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tuliskan komentar anda..."
          >
          </textarea>
          <div class="mt-3 flex justify-end">
            <button
              @click="submitComment"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
            >
              Komentar
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <CommentCard
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
          />
        </div>
      </div>
    </main>

    <div v-else class="flex justify-center items-center h-screen">
      <p class="text-gray-500">Memuat postingan...</p>
    </div>
  </div>
</template>
