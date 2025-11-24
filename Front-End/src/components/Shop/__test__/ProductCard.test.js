import { mount } from "@vue/test-utils";
import ProductCard from "../ProductCard.vue";

// TEST ini memastikan ProductCard menampilkan nama & harga produk dengan benar
describe("ProductCard.vue", () => {
    it("menampilkan nama & harga produk", () => {
        const product = {
        id: 1,
        name: "Joran Shimano",
        price_sale: 450000,
        img: "test.jpg"
        };

        const wrapper = mount(ProductCard, {
        props: { product },
        global: {
            stubs: {
            "router-link": { template: "<a><slot /></a>" }
            }
        }
        });

        expect(wrapper.text()).toContain("Joran Shimano");
        expect(wrapper.text()).toContain("450.000"); // UI memang pakai format ini
    });
});
