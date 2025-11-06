<script setup>
import { ref } from 'vue';
import EventCard from './EventCard.vue'; 

const events = ref([
    {
        id: 1,
        imageUrl: 'https://placehold.co/400x300/E94A24/FFFFFF?text=Lomba+1',
        title: 'Lomba mancing akbar dengan grand prize mobil...',
        author: 'Oleh: Jaka',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-1'
    },
    {
        id: 2,
        imageUrl: 'https://placehold.co/400x300/F0A800/FFFFFF?text=Lomba+2',
        title: 'Rayakan kemerdekaan dengan lomba mancing...',
        author: 'Oleh: Bintang',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-2'
    },
    {
        id: 4,
        imageUrl: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Lomba+3',
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 5,
        imageUrl: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Lomba+3',
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 6,
        imageUrl: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Lomba+3',
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 7,
        imageUrl: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Lomba+3',
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 8,
        imageUrl: 'https://placehold.co/400x300/3498DB/FFFFFF?text=Lomba+3',
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    }
]);
</script>

<template>
    <section class="w-full bg-gray-50 py-16">
        <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-10">
            Event & Perlombaan
        </h2>
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
