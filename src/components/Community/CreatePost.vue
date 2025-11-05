<script setup>
// Import Icon dari Iconify
import { Icon } from '@iconify/vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <main class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <form class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-8">
        <div class="space-y-6">
          <div>
            <label for="kategori" class="sr-only">Berikan Kategori</label>
                <select id="kategori" name="kategori" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Berikan Kategori</option>
              <option>Umpan</option>
              <option>Piranti</option>
              <option>Laporan Mancing</option>
              <option>Tips & Trik</option>
            </select>
          </div>

          <div>
            <label for="judul" class="sr-only">Berikan judul yang menarik</label>
            <input type="text" id="judul" name="judul" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="berikan judul yang menarik">
          </div>

          <div>
            <label for="pendapat" class="sr-only">Ketik pendapat anda</label>
            <textarea id="pendapat" name="pendapat" rows="10" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="ketik pendapat anda"></textarea>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <button type="button" class="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-50">
            <Icon icon="heroicons-solid:photo" class="h-5 w-5" />
            <span>Berikan gambar</span>
          </button>
          
          <div class="flex space-x-3">
            <button type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm">
              Simpan
            </button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm">
              Publikasikan
            </button>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>