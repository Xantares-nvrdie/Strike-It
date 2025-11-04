<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

import LocationCard from '@/components/Booking/LocationCard.vue';
import jakartaImg from '@/assets/locationimg/jakarta.jpg';
import bandungImg from '@/assets/locationimg/bandung.png';
import bekasiImg from '@/assets/locationimg/bekasi.png';
import bantenImg from '@/assets/locationimg/banten.png';
import tangerangImg from '@/assets/locationimg/tangerang.png';

const locations = ref([
  {
    city: 'Jakarta',
    address: 'Jl. Kh Hasyim Ashari No.125',
    description: 'Suasananya asri dan dikelilingi pepohonan. Karena merupakan fasilitas publik, kelengkapan fasilitasnya tidak seperti kolam pemancingan komersial, namun tetap menjadi favorit untuk bersantai.',
    imageUrl: jakartaImg
  },
  {
    city: 'Bandung',
    address: 'Jl. Diponegoro No.22, Citarum',
    description: 'Atmosfernya penuh semangat kompetisi, dengan para pemancing serius yang fokus memantau ujung jorannya. Karena tujuannya adalah perlombaan untuk mendapatkan ikan terberat, fasilitasnya lebih fungsional dan kurang ditujukan untuk rekreasi keluarga. Namun, tempat ini menjadi surga bagi mereka yang mencari tantangan dan sensasi adrenalin saat umpan disambar ikan babon.',
    imageUrl: bandungImg
  },
  {
    city: 'Bekasi',
    address: 'Jl. Pramuka No.59',
    description: 'Suasananya dirancang untuk rekreasi keluarga, sering kali dilengkapi saung lesehan di atas air dan alunan musik yang santai. Karena mengutamakan pengalaman bersantap dan kenyamanan, jenis ikannya mudah dipancing dan sering kali sudah ditentukan untuk langsung diolah. Meskipun begitu, tempat ini adalah pilihan sempurna untuk memperkenalkan hobi memancing kepada anak-anak sambil menikmati akhir pekan bersama.',
    imageUrl: bekasiImg
  },
  {
    city: 'Banten',
    address: 'Jl. Pelelangan Ikan Karangantu',
    description: 'Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Karena benar-benar berada di lokasi liar, aksesnya bisa jadi sulit dan tidak ada jaminan akan mendapatkan ikan. Akan tetapi, di sinilah letak petualangannya, memberikan kepuasan luar biasa saat berhasil mendaratkan ikan asli penghuni perairan tersebut.',
    imageUrl: bantenImg
  },
  {
    city: 'Tangerang',
    address: 'Jl. Pegangsaan Timur No 55',
    description: 'Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Karena benar-benar berada di lokasi liar, aksesnya bisa jadi sulit dan tidak ada jaminan akan mendapatkan ikan. Akan tetapi, di sinilah letak petualangannya, memberikan kepuasan luar biasa saat berhasil mendaratkan ikan asli penghuni perairan tersebut.',
    imageUrl: tangerangImg
  }
])
</script>

<template>
  <div class="text-center my-16">
    <h1 class="text-4xl font-medium text-black md:text-6xl">
      Detail Lokasi
    </h1>
    <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
      Berlokasi strategis di pusat kota.
    </p>
  </div>
  <div class="flex justify-center items-center flex-col gap-5 mb-24">
    <LocationCard class="" v-for="location in locations" :key="location.city" :location="location" />
  </div>
</template>