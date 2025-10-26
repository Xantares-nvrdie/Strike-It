<template>
  <section class="min-h-screen bg-white text-center pt-24 pb-16">
    <div class="container-deskripsi-preview px-4">
      <h2 class="text-4xl md:text-5xl font-medium text-black">Lokasi Tempat Pemancingan</h2>
      <p class="mt-5 text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
        Jelajahi destinasi pemancingan terbaik di sekitar Anda. Temukan tempat favorit baru untuk petualangan memancing Anda selanjutnya, mulai dari kolam harian hingga galatama.
      </p>
    </div>

    <div class="container-list-preview mt-12 px-4">
      <ul class="flex justify-center items-center space-x-5 overflow-x-auto py-2">
        <li>
          <button class="btn-arrow">
            <img src="./assets/left-arrow.png" alt="left-arrow" class="w-5 h-5 block mx-auto">
          </button>
        </li>
        <li><button class="btn-location">Jakarta</button></li>
        <li><button class="btn-location">Bandung</button></li>
        <li><button class="btn-location">Bekasi</button></li>
        <li><button class="btn-location">Bogor</button></li>
        <li><button class="btn-location">Banten</button></li>
        <li>
          <button class="btn-arrow">
            <img src="./assets/right-arrow.png" alt="right-arrow" class="w-5 h-5 block mx-auto">
          </button>
        </li>
      </ul>
    </div>

    <div class="container-img-preview flex flex-col items-center mt-10 mx-auto">
      <img src="./assets/preview.webp" alt="preview" class="w-[90vw] md:w-[50vw] h-72 object-cover rounded-t-xl shadow-lg">
      <button class="w-[90vw] md:w-[50vw] py-3 bg-blue-600 text-white text-lg font-semibold rounded-b-xl hover:bg-blue-700 transition duration-300 ease-in-out">
        Booking Sekarang
      </button>
    </div>
  </section>
</template>

<style scoped>
.btn-location {
    font-family: "Outfit", "sans-serif";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: none;
    background: rgba(3, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.2s;
}
.btn-location:hover {
    background: rgba(3, 0, 0, 0.25);
    transform: translateY(-2px);
}

.btn-arrow {
    border: none;
    border-radius: 20px;
    width: 40px;
    height: 40px;
    background: rgba(3, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>