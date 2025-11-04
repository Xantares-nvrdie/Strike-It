<script setup>
  import { Icon } from '@iconify/vue';
</script>

<template>
  <footer class="relative w-full py-12 text-white bg-[#003bb3] font-['Outfit']">
    <div class="absolute top-[-8rem] left-0 w-full h-32 bg-gradient-to-t from-[#003bb3] to-transparent z-10"></div>

    <div class="relative w-full px-6 z-20">
      
      <div class="grid gap-8 text-sm md:grid-cols-3">
        <div class="glass-box">
          <h3 class="mb-3 text-lg font-semibold">Contact Us!</h3>
          <p class="flex items-center gap-2">
            <i class="text-blue-400 fas fa-phone"></i> +62 8xxx xxxx xxxx
          </p>
          <p class="flex items-center gap-2 mt-2">
            <i class="text-blue-400 fas fa-map-marker-alt"></i> Jl. Raya Lembang No.46
          </p>
        </div>

        <div class="glass-box">
          <h3 class="mb-3 text-lg font-semibold">About Us!</h3>
          <p class="text-sm leading-relaxed text-gray-200">
            Kami adalah komunitas pemancing yang berdedikasi untuk menciptakan pengalaman memancing yang menyenangkan.
            Kami percaya bahwa memancing adalah proses dan perjalanan, bukan sekadar hasil tangkapan.
          </p>
          <p class="mt-2 text-sm text-gray-300">
            Misi kami adalah membantu Anda menciptakan kenangan berharga yang akan bertahan seumur hidup.
          </p>
        </div>

        <div class="text-center glass-box md:text-left">
          <h3 class="mb-3 text-lg font-semibold">Reach Us</h3>
          <div class="flex justify-center gap-4 mt-2 md:justify-start">
            <a href="#" class="icon-btn w-10 h-10">
              <Icon icon="ic:round-facebook" class="z-10 w-full h-full"/>
            </a>
            <a href="#" class="icon-btn w-10 h-10">
              <Icon icon="ri:instagram-line" class="z-10 w-full h-full"/>
            </a>
            <a href="#" class="icon-btn w-10 h-10">
              <Icon icon="ri:twitter-x-fill" class="z-10 w-full h-full" />
            </a>
            <a href="#" class="icon-btn w-10 h-10">
              <Icon icon="ic:sharp-tiktok" class="z-10 w-full h-full" />
            </a>
          </div>
        </div>

      </div>

      <div class="mt-10 text-sm text-center text-gray-300">
        © 2025 <span class="font-semibold text-white">Strike It</span>. All rights reserved.
      </div>
    </div>

  </footer>
</template>



<style scoped>
.glass-box {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem; /* rounded-3xl */
  padding: 1.5rem; /* p-6 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  transition: background-color 0.3s ease;
}

.glass-box:hover {
  background-color: rgba(255, 255, 255, 0.2); /* hover:bg-white/20 */
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3); /* border-white/30 */
  border-radius: 9999px; /* rounded-full */
  transition: background-color 0.3s ease;
}

.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.2); /* hover:bg-white/20 */
}
</style>
