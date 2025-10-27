<template>
    <section class="relative w-screen h-screen bg-gradient-to-b from-blue-900 to-white flex justify-center items-center gap-5 p-12 overflow-hidden">

    <!-- Wave -->
    <div class="absolute bottom-0 left-0 w-full h-[30vh] z-20"
            :style="{ backgroundImage: 'url(/src/assets/wave1.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'cover' }">
    </div>

    <!-- Pemancing image -->
    <div class="w-[70vw] h-[70vh] z-10 bg-center bg-cover"
            :style="{ backgroundImage: 'url(/src/assets/mancing2.png)' }">
    </div>

    <!-- Text section -->
    <div class="absolute top-1/2 left-12 transform -translate-y-1/2 z-50 w-96 p-5 rounded-2xl text-white">
        <h1 class="font-outfit font-extrabold text-[5rem] mb-5">Strike It</h1>
        <p class="text-lg leading-relaxed mb-7 text-gray-100">
        Kami adalah komunitas pemancing yang berdedikasi untuk menciptakan pengalaman memancing yang
        menyenangkan. Kami percaya bahwa memancing adalah sebuah proses dan perjalanan, bukan sekadar hasil tangkapan.
        Misi kami adalah membantu Anda menciptakan kenangan berharga yang akan bertahan seumur hidup.
        </p>
        
        <div class="flex gap-3">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-transform transform hover:-translate-y-0.5">
            Book Sekarang
        </button>
        <button class="bg-transparent border border-white/30 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-transform transform hover:-translate-y-0.5">
            Sewa Alat
        </button>
        </div>
    </div>

    </section>
</template>

<script>
export default {
    name: "ProfileSection",
};
</script>
