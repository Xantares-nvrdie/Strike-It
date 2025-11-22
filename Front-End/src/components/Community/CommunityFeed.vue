<script setup>
import { ref, onMounted } from 'vue';
import PostCard from '@/components/Community/PostCard.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import api from '@/services/api.js';

const router = useRouter();
const posts = ref([]);
const baseUrl = 'http://localhost:3000/uploads'; // Sesuaikan jika perlu

function navigateToCreatePost() {
  router.push('/community/create-post');
}

// Helper Time Ago
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 3600;
    if (interval > 24) return Math.floor(interval / 24) + " hari lalu";
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "Baru saja";
};

const fetchPosts = async () => {
    try {
        const response = await api.getAllPosts();
        posts.value = response.data.map(p => ({
            id: p.id,
            author: { 
                name: p.author_name, 
                // Handle Avatar URL logic
                avatar: p.author_avatar ? (p.author_avatar.startsWith('http') ? p.author_avatar : `${baseUrl}/${p.author_avatar}`) : 'https://ui-avatars.com/api/?name=' + p.author_name
            },
            time: timeAgo(p.created_at),
            title: p.title,
            content: p.body,
            // DB punya kolom 'category', kita masukkan ke array tags
            tags: [p.category], 
            stats: { 
                views: p.views_count || 0, 
                comments: p.reply_count || 0, 
                likes: p.likes_count || 0 
            },
        }));
    } catch (error) {
        console.error("Gagal memuat feed:", error);
    }
};

onMounted(() => {
    fetchPosts();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:items-start">
        <div class="lg:col-span-2 space-y-4 order-2 lg:order-none">
          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
        <aside class="lg:col-span-1 space-y-6 order-1 lg:order-none lg:sticky top-[88px]">
          <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">
              Postingan Rekomendasi
            </h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-sm text-blue-600 hover:underline">Mancing mania membuat kita bahagia</a></li>
              <li><a href="#" class="text-sm text-blue-600 hover:underline">Cabang bandung gacor banget euy!!!</a></li>
            </ul>
          </div>
          <button
            class="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 px-4 rounded-[2rem] shadow-md flex items-center justify-center space-x-2" @click="navigateToCreatePost">
            <Icon icon="heroicons-solid:plus" class="h-5 w-5" />
            <span>Tulis postingan anda</span>
          </button>
        </aside>
      </div>
    </main>
  </div>
</template>
