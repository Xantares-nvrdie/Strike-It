import { mount } from "@vue/test-utils";
import Register from "../Register.vue";
import api from "@/services/api";

vi.mock("@/services/api", () => ({
  default: {
    register: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe("Register.vue", () => {
  it("render form register", () => {
    const wrapper = mount(Register);
    expect(wrapper.find("#name").exists()).toBe(true);
    expect(wrapper.find("#email").exists()).toBe(true);
    expect(wrapper.find("#password").exists()).toBe(true);
    expect(wrapper.find("#confirm-password").exists()).toBe(true);
  });

  it("field dapat diinput", async () => {
    const wrapper = mount(Register);
    await wrapper.find("#name").setValue("Bintang");
    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirm-password").setValue("123456");
    expect(wrapper.vm.name).toBe("Bintang");
    expect(wrapper.vm.email).toBe("test@gmail.com");
    expect(wrapper.vm.password).toBe("123456");
  });

  it("submit memanggil api.register()", async () => {
    const wrapper = mount(Register);

    await wrapper.find("#name").setValue("Bintang");
    await wrapper.find("#email").setValue("test@gmail.com");
    await wrapper.find("#password").setValue("123456");
    await wrapper.find("#confirm-password").setValue("123456");

    await wrapper.find("form").trigger("submit.prevent");

    expect(api.register).toHaveBeenCalled();
  });
});
