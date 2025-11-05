<script setup>
import { ref } from 'vue';
import PostCard from '@/components/Community/PostCard.vue';
// Import Icon dari Iconify
import { Icon } from '@iconify/vue';

// Dummy data for posts
const posts = ref([
  {
    id: 1,
    author: { name: 'Joran_Melengkung', avatar: 'https://images.unsplash.com/photo-1517365830460-955e33302308?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    time: '8 menit lalu',
    title: 'Umpan putih andalan untuk ikan mas lagi susah makan?',
    content: 'Para suhu, mohon pencerahannya dong. Biasanya pakai umpan putih dasar amis wangi jalan, tapi seminggu ini boncos terus di kolam harian. Ada rekomendasi essen atau oplosan lain yang lagi gacor?',
    tags: ['umpan', 'tips'],
    stats: { views: 123, comments: 15, likes: 155 },
  },
  {
    id: 2,
    author: { name: 'Kang_Asep_Mancing', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    time: '1 jam lalu',
    title: 'Laporan Mancing Barramundi di Muara Gembong!',
    content: 'Akhir pekan kemarin nekat coba peruntungan di Muara Gembong. Walaupun cuaca agak panas, alhamdulillah berhasil mendaratkan beberapa ekor babon barramundi. Spotnya mantap, tarikannya bikin ketagihan!',
    tags: ['laporan mancing'],
    stats: { views: 123, comments: 15, likes: 155 },
  },
  {
    id: 3,
    author: { name: 'Pemua_Casting', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    time: '5 jam lalu',
    title: 'Rekomendasi Reel Baitcasting Budget 500 ribuan?',
    content: 'Numpang tanya master-master, saya baru mau coba teknik baitcasting. Ada rekomendasi reel BC yang bagus buat pemula dengan budget sekitar 500rb? Yang penting smooth dan awet buat belajar.',
    tags: ['piranti', 'rekomendasi', 'baitcasting'],
    stats: { views: 123, comments: 15, likes: 155 },
  },
]);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>

        <aside class="lg:col-span-1 space-y-6">
          <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">
              Postingan Rekomendasi
            </h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-sm text-blue-600 hover:underline">Mancing mania membuat kita bahagia</a></li>
              <li><a href="#" class="text-sm text-blue-600 hover:underline">Cabang bandung gacor banget euy!!!</a></li>
            </ul>
          </div>
          
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-[2rem] shadow-md flex items-center justify-center space-x-2">
            <Icon icon="heroicons-solid:plus" class="h-5 w-5" />
            <span>Tulis postingan anda</span>
          </button>
        </aside>
      </div>
    </main>
  </div>
</template>