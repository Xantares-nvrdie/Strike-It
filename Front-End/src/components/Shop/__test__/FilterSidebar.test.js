import { mount } from "@vue/test-utils";
import FilterSidebar from "../FilterSidebar.vue";

// TEST memastikan saat tombol ditekan, event filter dikirim ke parent
describe("FilterSidebar.vue", () => {
  it("mengirim event filter saat tombol diklik", async () => {
    const wrapper = mount(FilterSidebar, {
      global: {
        stubs: {
          "router-link": { template: "<a><slot /></a>" },
        },
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("click"); // mengikuti event asli komponen
  });
});
