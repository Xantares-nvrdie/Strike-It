// Import library testing Vue
import { mount } from "@vue/test-utils";
// Import komponen yang akan dites
import EventCard from "../EventCard.vue";

// Grouping test suite untuk EventCard
describe("EventCard.vue", () => {
  // Skenario Test: Memastikan judul event muncul di HTML
  it("merender judul event", () => {
    // 1. Setup Data Mock (Data palsu untuk tes)
    const event = { id: 10, title: "Turnamen Mancing", date: "2025" };

    // 2. Mount Komponen
    // Memasang EventCard ke DOM virtual dengan menyuntikkan props 'event'
    const wrapper = mount(EventCard, {
      props: { event },
    });

    // 3. Assertion (Pengecekan)
    // Memastikan teks di dalam komponen mengandung kata "Turnamen Mancing"
    expect(wrapper.text()).toContain(event.title);
  });
});
