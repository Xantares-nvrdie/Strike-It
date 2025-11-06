<script setup>
    import { ref } from 'vue'
    import { Icon } from '@iconify/vue';
    const isAvailable = ref(true)

    const thumbnailImages = ref([
        'images/poster1.png',
        'images/poster1.png',
        'images/poster1.png',
        'images/poster1.png',
        'images/poster1.png',
        'images/poster1.png',
    ]);
    
    const mainImage = ref(thumbnailImages.value[0]);
    function selectThumbnail(image) {
        mainImage.value = image;
    }
</script>

<template>
    <section class="w-full min-h-screen p-5 flex flex-col justify-start items-start bg-zinc-100">
        <div class="w-full p-5 bg-zinc-100 flex flex-col lg:flex-row justify-center items-start gap-10 rounded-lg">
            
            <div class="flex-1 w-full bg-zinc-100 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] p-5 rounded-lg flex flex-col justify-center">
                <img :src="mainImage" alt="Product" class="max-w-[513px] max-h-[497px] w-full object-cover mx-auto rounded-lg">
                
                <div class="flex flex-row items-center mt-10 gap-4 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] overflow-x-auto whitespace-nowrap px-4 py-2 bg-zinc-100">
                    <img 
                        v-for="(image, index) in thumbnailImages" 
                        :key="index"
                        :src="image" 
                        :alt="'Thumbnail ' + (index + 1)" 
                        class="w-[100px] h-[100px] object-cover rounded-lg cursor-pointer flex-shrink-0
                            border-2 transition-all duration-200
                            border-transparent hover:border-blue-600" :class="{'border-blue-600': image === mainImage}" @click="selectThumbnail(image)"
                    >
                </div>
            </div>

            <div class="flex-1 w-full bg-blue-200 p-5 rounded-lg text-black">
                <h1 class="text-2xl font-medium" >Joran Pancing Predator X87813PP</h1>
                <span class="text-5xl font-medium">Rp.3.000.000,00</span>
                <ul class="list-disc ml-5 mt-4 space-y-2">
                    </ul>
                <div class="mt-2.5">
                    </div>
                <div class="flex flex-col sm:flex-row gap-4 mt-4">
                    <input 
                        type="number"
                        id="quantity"
                        class="w-full sm:w-[100px] p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        placeholder="Quantity"
                        value="1"
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
