import { mount } from "@vue/test-utils";
import EventCard from "../EventCard.vue";

describe("EventCard.vue", () => {
    it("merender judul event", () => {
        const event = { id: 10, title: "Turnamen Mancing", date: "2025" };

        const wrapper = mount(EventCard, {
        props: { event }
        });

        expect(wrapper.text()).toContain(event.title);
    });
});
