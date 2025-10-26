<template>
    <section class="relative h-screen bg-gradient-to-b from-[#0768a0] to-white flex justify-center items-center pt-20 overflow-hidden">
    
    <div class="w-[70vw] h-[70dvh] bg-cover bg-center absolute right-0 top-1/2 -translate-y-1/2 md:w-[70vw] md:h-[70dvh]" style="background-image: url('./assets/mancing2.png'); z-index: 1;"></div>

    <div class="relative text-white z-10 p-4 md:p-8 max-w-lg mx-auto md:mx-0 md:absolute md:top-1/2 md:-translate-y-1/2 md:left-20 lg:left-24 xl:left-40 text-center md:text-left">
        <h1 class="text-6xl md:text-7xl font-extrabold mb-5 drop-shadow-lg">Strike It</h1>
        <p class="text-lg mb-8 leading-relaxed">Kami adalah komunitas pemancing yang berdedikasi untuk menciptakan pengalaman memancing yang menyenangkan. Kami percaya bahwa memancing adalah sebuah proses dan perjalanan, bukan sekadar hasil tangkapan. Misi kami adalah membantu Anda menciptakan kenangan berharga yang akan bertahan seumur hidup.</p>
        
        <div class="flex flex-wrap justify-center md:justify-start gap-4">
        <button class="btn-hero bg-blue-600 hover:bg-blue-700">Book Sekarang</button>
        <button class="btn-hero bg-transparent border-white/30 hover:bg-white/25">Sewa Alat</button>
        </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full h-1/5 bg-repeat-x bg-bottom z-20" style="background-image: url('./assets/wave1.png'); background-size: contain;"></div>
    </section>
    </template>

    <style scoped>
    .btn-hero {
    font-family: "Outfit", "sans-serif";
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    color: white;
    border: 1px solid transparent;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    }
    
    .btn-hero:hover {
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }
</style>