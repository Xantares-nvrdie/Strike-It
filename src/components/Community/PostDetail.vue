<script setup>
import { ref } from 'vue';
import CommentCard from '@/components/Community/CommentCard.vue';
// Import Icon dari Iconify
import { Icon } from '@iconify/vue';

// Dummy data for comments
const comments = ref([
  {
    id: 1,
    author: { name: 'Suhu_Galatama', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1c3711aa1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    time: '2 jam lalu',
    content: 'Wah... mas, kalau musim hujan biasanya ikan lebih suka aroma yang lebih kuat/menyengat. Coba resepnya ditambahin sedikit susu Dancow (1 sachet) dan parutan keju craft. Dehonya juga Coba pake 2 sendok. Harusnya aromanya lebih nendang.',
  },
  {
    id: 2,
    author: { name: 'Suju_Galatama', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    time: 'Oleh @lazypiepeer',
    content: '@Suhu_Galatama, kalau boleh tau, perbandingan dehonya gimana mas? Pakek atau oplos? Terima kasih suhu, coba sarannya aroma amis dari Deho, tapi pakek aroma wangi dari essen. Kadang ikan jenuh sama bau amis yang terlalu kuat.',
  },
]);
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6 sm:p-8">
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-3">
            <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955e33302308?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Joran_Melengkung">
            <div>
              <a href="#" class="text-sm font-semibold text-gray-900 hover:underline">@Joran_Melengkung</a>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <Icon icon="heroicons-solid:ellipsis-vertical" class="h-5 w-5" />
          </button>
        </div>

        <article class="mt-6 text-black prose prose-sm max-w-none">
          <h2>Umpan putih andalan untuk ikan mas lagi susah makan? Mohon pencerahannya!</h2>
          <p>Para suhu, dan rekan angler, mohon pencerahannya. Sudah dua minggu ini saya coba mancing harian ikan mas di kolam langganan, tapi hasilnya boncos terus. Padahal biasanya resep umpan putih andalan saya ini selalu gacor. Resep yang saya pakai saat ini:</p>
          <div class="bg-gray-100 p-4 rounded-md not-prose">
            <ol class="list-decimal list-inside text-sm text-gray-800 space-y-1">
              <li>Pa Ikin Putih</li>
              <li>Telur bebek (1 butir, pakai kuningnya saja)</li>
              <li>Deho (1 sendok makan)</li>
              <li>Kroto (secukupnya, direndam air panas)</li>
              <li>Essen oplosan (aroma dominan amis)</li>
            </ol>
          </div>
          <p>Awalnya narik terus, tapi sekarang ikan cuma nengok doang, nggak mau makan. Apa mungkin karena cuaca sering hujan jadi Ph air berubah ya? Atau ada bahan yang perlu saya ganti/tambah? Mungkin ada suhu di sini yang punya resep umpan putih andalan buat kondisi ikan lagi mogok makan.</p>
          <p>Terima kasih sebelumnya!</p>
        </article>

        <div class="mt-6 flex justify-between items-center">
          <div class="flex space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 bg-[#e5e5e5] rounded-full text-xs font-medium text-gray-600">
              umpan putih
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 bg-[#e5e5e5] rounded-full text-xs font-medium text-gray-600">
              ikan mas
            </span>
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
            <Icon icon="heroicons-solid:plus" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-lg text-center font-bold text-gray-900 mb-6">Balasan</h2>

        <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-5 mb-6">
          <textarea rows="3" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Tuliskan komentar anda..."></textarea>
          <div class="mt-3 flex justify-end">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm">
              Komentar
            </button>
          </div>
        </div>
        
        <div class="space-y-4">
          <CommentCard v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>
      </div>
    </main>
  </div>
</template>
