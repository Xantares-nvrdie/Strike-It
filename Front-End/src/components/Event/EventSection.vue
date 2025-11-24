<script setup>
import { ref, onMounted } from 'vue';
import EventCard from './EventCard.vue'; 
import api from '@/services/api.js';

// State untuk menyimpan daftar event
const events = ref([]);
const baseUrl = 'http://localhost:3000';
const staticPrefix = '/uploads';

// Fetch Events dari Backend
const fetchEvents = async () => {
    try {
        const response = await api.getEvents();
        
        // Mapping data dari Database ke format yang dibutuhkan EventCard
        events.value = response.data.map(evt => {
            let imgPath = evt.img;
            
            // Logic untuk handle URL gambar dari backend
            if (imgPath && !imgPath.startsWith('http')) {
                const cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
                imgPath = `${baseUrl}${staticPrefix}/${cleanPath}`;
            }
            
            return {
                id: evt.id, 
                imageUrl: imgPath,
                title: evt.name,        
                author: 'Admin Strike It', 
                date: 'Segera Hadir',     
                externalLink: evt.link_url 
            };
        });
    } catch (error) {
        console.error("Gagal memuat data event:", error);
    }
};

onMounted(() => {
    fetchEvents();
});
</script>

<template>
    <section class="w-full bg-gray-50 py-16">
        <div class="max-w-6xl mx-auto px-4 text-center space-y-12">
        <h1 class="text-4xl font-medium text-black md:text-6xl">
            Event & Perlombaan
        </h1>
        <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
            Temukan berbagai event dan perlombaan mancing seru yang bisa kamu ikuti untuk menguji
            keterampilan dan keberuntunganmu.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCard
            v-for="event in events"
            :key="event.id"
            :event="event"
            />
        </div>
        </div>
    </section>
</template>
