import { mount } from "@vue/test-utils";
import ProductList from "../ProductList.vue";

// TEST memastikan jumlah kartu produk yg dirender sesuai jumlah props
describe("ProductList.vue", () => {
    it("merender jumlah card sesuai jumlah produk", () => {
        const products = [
        { id: 1, name: "A", price_sale: 100 },
        { id: 2, name: "B", price_sale: 200 }
        ];

        const wrapper = mount(ProductList, {
        props: { products },
        global: {
            stubs: {
            "router-link": { template: "<a><slot /></a>" }
            }
        }
        });

        expect(wrapper.findAllComponents({ name: "ProductCard" }).length).toBe(2);
    });
});
