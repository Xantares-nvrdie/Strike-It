<script setup>

</script>

<template>
    <section class="w-full min-h-screen p-5 flex flex-col justify-start items-start bg-zinc-100">
        <div class="w-full p-5 bg-gray-500 flex flex-row justify-center items-center gap-10 rounded-lg">
            <div class="flex-1 bg-red-200 p-5 rounded-lg flex flex-col justify-center">
                <img src="../../assets/poster1.png" alt="Product" class="max-w-[513px] max-h-[497px] w-full object-cover mx-auto">
                <div class="flex flex-row justify-center items-center mt-10 gap-20">
                    <img src="../../assets/poster1.png" alt="Product" class="w-[100px] h-[100px] object-cover">
                    <img src="../../assets/poster1.png" alt="Product" class="w-[100px] h-[100px] object-cover">
                    <img src="../../assets/poster1.png" alt="Product" class="w-[100px] h-[100px] object-cover">
                </div>
            </div>
            <div class="flex-1 bg-blue-200 p-5 rounded-lg text-black">
                <h1 class="text-2xl font-medium" >Joran Pancing Predator X87813PP</h1>
                <span class="text-5xl font-medium">Rp.3.000.000,00</span>
                <ul class="list-disc ml-5 mt-4 space-y-2">
                    <li>Spesifikasi Joran</li>
                    <li>Spesifikasi Joran</li>
                    <li>Spesifikasi Joran</li>
                </ul>
                <div class="mt-2.5">
                    In Stock?
                </div>
                <div class="flex flex-row gap-4 mt-4">
                    <input 
                        type="number"
                        id="min-price"
                        class="w-[100px] p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        placeholder="Quantity"
                    >
                    <button 
                        type="submit"
                        class="w-full px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-base font-medium font-['Outfit'] hover:from-blue-700 hover:to-blue-400 transition duration-300"
                    >
                        Sewa
                    </button>
                    <button 
                        type="submit"
                        class="w-full px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-base font-medium font-['Outfit'] hover:from-blue-700 hover:to-blue-400 transition duration-300"
                    >
                        Beli
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
