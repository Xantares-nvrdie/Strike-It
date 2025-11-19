<script setup>
import { ref } from 'vue';
import EventCard from './EventCard.vue'; 
import event1 from '../../assets/eventimg/poster1.png';
import event2 from '../../assets/eventimg/poster2.png';
import event3 from '../../assets/eventimg/poster3.png';
import event4 from '../../assets/eventimg/poster4.jpg';
import event5 from '../../assets/eventimg/poster5.jpg';
import event6 from '../../assets/eventimg/poster6.jpeg';
const events = ref([
    {
        id: 1,
        imageUrl: event1,
        title: 'Lomba mancing akbar dengan grand prize mobil...',
        author: 'Oleh: Jaka',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-1'
    },
    {
        id: 2,
        imageUrl: event2,
        title: 'Rayakan kemerdekaan dengan lomba mancing...',
        author: 'Oleh: Bintang',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-2'
    },
    {
        id: 4,
        imageUrl: event3,
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 5,
        imageUrl: event4,
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 6,
        imageUrl: event5,
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
    {
        id: 7,
        imageUrl: event6,
        title: 'Adu keberuntungan di lomba mancing Karang Taruna...',
        author: 'Oleh: Glenn Devito',
        date: 'Feb 5, 2025',
        externalLink: 'https://drive.google.com/link-anda-3'
    },
]);
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
