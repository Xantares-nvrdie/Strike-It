// Test ini untuk memastikan bahwa EventSection:
// 1) Bisa di-mount tanpa error
// 2) Akan merender jumlah kartu event sesuai data di state `events`
//    (kita set manual dari test, tanpa ketergantungan API)

import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import EventSection from "../EventSection.vue";

describe("EventSection.vue", () => {
    it("merender jumlah kartu sesuai data events", async () => {
        // MOUNT:
        // - Kita stub EventCard supaya fokus test di EventSection saja
        const wrapper = mount(EventSection, {
        global: {
            stubs: {
            // Stub komponen EventCard sebagai <div class="event-card-stub" />
            EventCard: {
                template: '<div class="event-card-stub" />',
            },
            },
        },
        });

        // MANIPULASI STATE:
        // - Karena EventSection pakai <script setup> dengan `const events = ref([])`
        //   maka `events` bisa diakses lewat wrapper.vm.events
        // - Kita isi manual dengan 2 event mock supaya deterministik,
        //   tidak tergantung hasil API / onMounted
        wrapper.vm.events = [
        {
            id: 1,
            imageUrl: "https://example.com/1.jpg",
            title: "Event 1",
            author: "Admin",
            date: "Segera",
            externalLink: "https://example.com/1",
        },
        {
            id: 2,
            imageUrl: "https://example.com/2.jpg",
            title: "Event 2",
            author: "Admin",
            date: "Segera",
            externalLink: "https://example.com/2",
        },
        ];

        // Tunggu DOM update setelah mengubah state
        await nextTick();

        // ASSERT:
        // - Karena EventCard kita stub menjadi <div class="event-card-stub" />,
        //   cukup hitung jumlah elemen dengan class tersebut.
        const cards = wrapper.findAll(".event-card-stub");

        // Pastikan jumlah card sesuai yang kita set (2 event)
        expect(cards.length).toBe(2);
    });
});
