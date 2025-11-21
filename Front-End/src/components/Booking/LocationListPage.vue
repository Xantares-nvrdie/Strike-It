<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

import LocationCard from '@/components/Booking/LocationCard.vue';

const locations = ref([
  {
    city: 'Jakarta',
    address: 'Jl. Kh Hasyim Ashari No.125',
    description: 'Suasananya asri dan dikelilingi pepohonan. Karena merupakan fasilitas publik, kelengkapan fasilitasnya tidak seperti kolam pemancingan komersial, namun tetap menjadi favorit untuk bersantai.',
    imageUrl: '/locationimg/jakarta.jpg' 
  },
  {
    city: 'Bandung',
    address: 'Jl. Diponegoro No.22, Citarum',
    description: 'Atmosfernya penuh semangat kompetisi, dengan para pemancing serius yang fokus memantau ujung jorannya. Karena tujuannya adalah perlombaan untuk mendapatkan ikan terberat, fasilitasnya lebih fungsional.',
    imageUrl: '/locationimg/bandung.png'
  },
  {
    city: 'Bekasi',
    address: 'Jl. Pramuka No.59',
    description: 'Suasananya dirancang untuk rekreasi keluarga, sering kali dilengkapi saung lesehan di atas air dan alunan musik yang santai. Tempat ini adalah pilihan sempurna untuk memperkenalkan hobi memancing kepada anak-anak.',
    imageUrl: '/locationimg/bekasi.png'
  },
  {
    city: 'Banten',
    address: 'Jl. Pelelangan Ikan Karangantu',
    description: 'Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Karena benar-benar berada di lokasi liar, aksesnya bisa jadi sulit dan tidak ada jaminan akan mendapatkan ikan.',
    imageUrl: '/locationimg/banten.png'
  },
  {
    city: 'Tangerang',
    address: 'Jl. Pegangsaan Timur No 55',
    description: 'Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Tempat yang cocok untuk mencari ketenangan.',
    imageUrl: '/locationimg/tangerang.jpg' // Pastikan ekstensi file benar (jpg/png)
  }
])
</script>

<template>
  <div class="text-center my-10">
    <h1 class="text-4xl font-medium text-black md:text-6xl">
      Detail Lokasi
    </h1>
    <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
      Jelajahi berbagai cabang lokasi memancing Strike It! di seluruh Indonesia. Temukan tempat
      terbaik untuk menikmati hobi memancing Anda.
    </p>
  </div>
  <div class="flex justify-center items-center flex-col gap-5 mb-24">
    <LocationCard class="" v-for="location in locations" :key="location.city" :location="location" />
  </div>
</template>
