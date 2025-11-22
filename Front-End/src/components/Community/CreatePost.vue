<script setup>
import { ref } from 'vue';
import { Icon } from "@iconify/vue";
import api from '@/services/api.js';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

// State Form
const form = ref({
  category: '', // Default kosong
  title: '',
  body: ''
});

const isSubmitting = ref(false);

const goToCommunity = () => {
  router.push("/community");
};

// Handle Submit
const handleSubmit = async () => {
  // Validasi: Pastikan semua field terisi
  if (!form.value.category || !form.value.title || !form.value.body) {
    toast.warning("Mohon lengkapi kategori, judul, dan isi postingan!");
    return;
  }

  isSubmitting.value = true;
  try {
    // Kirim data ke backend
    // category langsung dikirim apa adanya karena value option sudah sesuai DB (lowercase)
    await api.createPost({
      title: form.value.title,
      body: form.value.body,
      category: form.value.category
    });

    toast.success("Postingan berhasil dibuat!");
    goToCommunity();
  } catch (error) {
    console.error(error);
    toast.error("Gagal membuat postingan.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <main class="max-w-3xl mx-auto py-4 sm:py-8 px-4">
      <form
        @submit.prevent="handleSubmit" 
        class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-4 sm:p-8"
      >
        <div class="space-y-6">
          <div>
            <label for="kategori" class="sr-only">Pilih Kategori</label>
            <select
              v-model="form.category"
              id="kategori"
              name="kategori"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option disabled value="">Pilih Kategori</option>
              <option value="general">General (Umum)</option>
              <option value="discussion">Discussion (Diskusi)</option>
              <option value="review">Review (Ulasan)</option>
              <option value="event">Event (Acara)</option>
            </select>
          </div>

          <div>
            <label for="judul" class="sr-only">Judul Postingan</label>
            <input
              v-model="form.title"
              type="text"
              id="judul"
              name="judul"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Berikan judul yang menarik..."
            />
          </div>

          <div>
            <label for="pendapat" class="sr-only">Isi Postingan</label>
            <textarea
              v-model="form.body"
              id="pendapat"
              name="pendapat"
              rows="10"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tuliskan pendapat, pertanyaan, atau cerita Anda di sini..."
            ></textarea>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
          <button type="button" class="inline-flex items-center justify-center sm:justify-start space-x-2 border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-50">
            <Icon icon="heroicons-solid:photo" class="h-5 w-5" />
            <span>Berikan gambar</span>
          </button>

          <div class="flex space-x-3 justify-center sm:justify-end">
            <button type="button" @click="goToCommunity" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm">
              Kembali
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm disabled:opacity-50"
            >
              {{ isSubmitting ? 'Memproses...' : 'Publikasikan' }}
            </button>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>
