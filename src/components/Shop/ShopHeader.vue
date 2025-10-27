<template>
    <div class="flex flex-col items-center w-full max-w-2xl gap-2 mx-auto">
        
        <nav aria-label="breadcrumb" class="w-full max-w-lg h-11 p-7 bg-white rounded-[10px] inline-flex justify-start items-center gap-1.5">
        <ol class="inline-flex justify-start items-center gap-1.5">
            <li class="inline-flex items-center gap-1.5">
            <a href="#" class="w-10 h-5 justify-center text-neutral-400 text-sm font-bold font-['Inter'] leading-5">Home</a>
            </li>
            <li class="w-1.5 h-5 justify-center text-gray-500 text-sm font-bold font-['Inter'] leading-5" aria-hidden="true">/</li>
            <li class="inline-flex items-center gap-1.5">
            <a href="#" class="w-9 h-5 justify-center text-neutral-400 text-sm font-bold font-['Inter'] leading-5">Shop</a>
            </li>
            <li class="w-1.5 h-5 justify-center text-gray-500 text-sm font-bold font-['Inter'] leading-5" aria-hidden="true">/</li>
        </ol>
        </nav>
        
        <form class="w-full max-w-lg px-5 py-2.5 bg-linear-131 from-white/20 to-gray-50/20 rounded-[37px] shadow-[5px_6px_22.899999618530273px_0px_rgba(0,0,0,0.13)] outline outline-[2.50px] outline-offset-[-2.50px] outline-white backdrop-blur-sm inline-flex justify-center items-end gap-2">
        
        <div class="flex-1 flex justify-start items-center gap-1.5">
            <div class="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-0.5">
            <label for="search-bar" class="justify-center text-neutral-600 text-sm font-medium font-['Outfit']">Cari</label>
            <input type="text" id="search-bar" placeholder="Masukkan barang apa yang dicari" class="self-stretch h-7 p-3.5 bg-linear-131 from-white rounded-[59px] shadow-[3.5256409645080566px_4.230769157409668px_16.147436141967773px_0px_rgba(0,0,0,0.13)] backdrop-blur-[5.29px] inline-flex justify-start items-center gap-5 w-full text-sky-900/50 text-xs sm:text-sm font-normal font-['Inter'] border-none focus:ring-0">
            </div>
        </div>
        
        <button type="submit" class="size- px-3 py-2 bg-linear-215 from-blue-800 to-blue-500/90 rounded-xl flex justify-center items-center gap-[4.81px]">
            <span class="text-center justify-start text-white text-[9.62px] font-normal font-['Poppins'] leading-3">Cari</span>
        </button>
        </form>
    </div>
</template>

<script setup>
// Tidak perlu script
</script>