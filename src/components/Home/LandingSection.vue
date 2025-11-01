<template>
    <section class="relative flex items-center justify-center w-screen h-screen gap-5 p-12 overflow-hidden bg-gradient-to-b from-[#003bb3] to-white">
        <!-- Wave -->
        <div class="absolute bottom-0 left-0 w-full h-[30vh] z-20"
            :style="{ backgroundImage: 'url(/src/assets/wave1.png)', backgroundRepeat: 'repeat-x', backgroundSize: 'cover' }">
        </div>

        <!-- Pemancing image -->
        <div class="w-[70vw] h-[70vh] z-1 bg-center bg-cover"
            :style="{ backgroundImage: 'url(/src/assets/mancing2.png)' }">
        </div>

        <!-- Text section -->
        <div class="absolute z-40 w-full p-5 text-center text-white transform -translate-x-1/2 -translate-y-1/2 
        top-1/2 left-1/2 sm:w-96 lg:w-[40rem] lg:left-32 lg:translate-x-0 rounded-2xl lg:text-left">
            <h1 class="font-outfit font-extrabold text-5xl sm:text-6xl md:text-[5rem] mb-5 leading-tight">
                Strike It!
            </h1>

            <p class="w-full text-base leading-relaxed text-gray-100 sm:text-lg mb-7">
                Kami adalah komunitas pemancing yang berdedikasi untuk menciptakan pengalaman memancing yang
                menyenangkan. Kami percaya bahwa memancing adalah sebuah proses dan perjalanan, bukan sekadar hasil
                tangkapan.
                Misi kami adalah membantu Anda menciptakan kenangan berharga yang akan bertahan seumur hidup.
            </p>
            <div class="flex flex-row justify-center gap-3 lg:justify-start">
                <button class="btn-glass w-40 h-12 text-lg hover:text-[#122f4f]">
                    Book Sekarang
                </button>
                <button class="btn-glass w-40 h-12 text-lg hover:text-[#122f4f]">
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
