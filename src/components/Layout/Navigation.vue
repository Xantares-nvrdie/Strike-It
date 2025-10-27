<template>
  <nav
    class="absolute top-0 left-0 z-50 flex items-center justify-between w-full px-10 py-4 font-semibold text-white"
  >
    <div class="logo">
      <img
        src="../assets/strikeit_logo.png"
        alt="Logo Strike It"
        class="w-[50px] h-[50px] object-contain"
      />
    </div>

    <ul class="list-none flex gap-x-[30px]">
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <button class="btn-glass group-hover:text-[#122f4f]">Home</button>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <button class="btn-glass group-hover:text-[#122f4f]">Lokasi</button>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <button class="btn-glass group-hover:text-[#122f4f]">Langganan</button>
      </li>
      <li class="transition-colors duration-300 ease-in-out cursor-pointer group">
        <button class="btn-glass group-hover:text-[#122f4f]">Penilaian</button>
      </li>
    </ul>

    <ul class="list-none flex items-center gap-x-2.5">
      <li>
        <img
          src="../assets/saskeh.jpg"
          alt="Foto Profile"
          class="object-cover w-10 h-10 rounded-full"
        />
      </li>
      <li>
        <button class="btn-glass">Profile</button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Sekarang kosong! */
</style>