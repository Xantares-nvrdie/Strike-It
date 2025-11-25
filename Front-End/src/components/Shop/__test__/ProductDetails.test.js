import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import ProductDetails from "../ProductDetails.vue";

vi.mock("@/services/api.js", () => ({
  default: {
    getProductDetail: vi.fn(() =>
      Promise.resolve({
        data: {
          id: 1,
          name: "Joran Shimano",
          price_sale: 450000,
        },
      }),
    ),
  },
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/product/:id", component: ProductDetails }],
});

// helper untuk menunggu update async
const wait = () => new Promise((resolve) => setTimeout(resolve));

describe("ProductDetails.vue", () => {
  test("menampilkan nama produk setelah fetch API", async () => {
    router.push("/product/1");
    await router.isReady();

    const wrapper = mount(ProductDetails, {
      global: {
        plugins: [router],
      },
    });

    // tahap awal loading
    expect(wrapper.text()).toContain("Memuat produk...");

    // tunggu async API resolve
    await wait();
    await nextTick();

    expect(wrapper.text()).toContain("Joran Shimano");
  });
});
