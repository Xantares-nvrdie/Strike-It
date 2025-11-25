import { mount } from "@vue/test-utils";
import Login from "../Login.vue";
import api from "@/services/api";
import { createRouter, createMemoryHistory } from "vue-router";

vi.mock("@/services/api", () => ({
  default: {
    login: vi.fn().mockResolvedValue({
      data: { token: "123", user: { name: "Test" } },
    }),
  },
}));

// router mock
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: "/home", component: { template: "<div>Home</div>" } }],
});

describe("Login.vue", () => {
  it("render form login", async () => {
    const wrapper = mount(Login, { global: { plugins: [router] } });
    expect(wrapper.find("#email").exists()).toBe(true);
    expect(wrapper.find("#password").exists()).toBe(true);
    expect(wrapper.find("button[type='submit']").exists()).toBe(true);
  });

  it("email & password dapat diinput", async () => {
    const wrapper = mount(Login, { global: { plugins: [router] } });
    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123");
    expect(wrapper.vm.email).toBe("test@gmail.com");
    expect(wrapper.vm.password).toBe("123");
  });

  it("submit memanggil api.login()", async () => {
    const wrapper = mount(Login, { global: { plugins: [router] } });

    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123");

    await wrapper.find("form").trigger("submit.prevent");

    expect(api.login).toHaveBeenCalled();
  });
});
