// Import dependencies testing
import { mount } from "@vue/test-utils";
import { nextTick } from "vue"; // Penting: Untuk menunggu update DOM Vue
import EventSection from "../EventSection.vue";

describe("EventSection.vue", () => {
  it("merender jumlah kartu sesuai data events", async () => {
    // 1. MOUNT KOMPONEN dengan STUB
    // Kita melakukan 'stub' (penggantian) pada komponen anak 'EventCard'.
    // Tujuannya: Agar test fokus pada logic EventSection saja,
    // tanpa memusingkan detail render di dalam EventCard.
    const wrapper = mount(EventSection, {
      global: {
        stubs: {
          // EventCard diganti dengan div sederhana class="event-card-stub"
          EventCard: {
            template: '<div class="event-card-stub" />',
          },
        },
      },
    });

    // 2. MANIPULASI STATE SECARA MANUAL
    // Kita mengakses variabel 'events' di dalam komponen via wrapper.vm
    // Kita isi manual agar tidak perlu memanggil API sungguhan (backend) saat test.
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

    // 3. MENUNGGU UPDATE DOM (nextTick)
    // Karena Vue bersifat asinkronus saat update state, kita harus tunggu
    // satu siklus (tick) agar perubahan data 'events' di atas direfleksikan ke HTML (v-for).
    await nextTick();

    // 4. ASSERTION (Verifikasi)
    // Mencari semua elemen dengan class ".event-card-stub"
    const cards = wrapper.findAll(".event-card-stub");

    // Memastikan jumlah elemen yang ditemukan (2) sama dengan jumlah data yang kita masukkan (2).
    expect(cards.length).toBe(2);
  });
});
