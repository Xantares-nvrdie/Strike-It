<template>
    <aside class="p-6 bg-white rounded-3xl shadow-lg flex flex-col gap-5">
        <form class="flex flex-col w-full gap-5">
            
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900">Filter</h2>
            <button type="reset" class="text-base font-bold text-blue-600 transition-colors hover:text-blue-700">Hapus</button>
            </div>
            
            <div class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold text-gray-800">Jenis Alat</h3>
            <div class="flex flex-wrap gap-2.5">
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300">
                    Joran
                </button>
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300">
                    Umpan
                </button>
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300">
                    Kail
                </button>
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300">
                    Reels Pancing
                </button>
            </div>
            </div>
            
            <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
                <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="fas fa-dollar-sign text-gray-400"></i>
                </span>
                <input type="number" id="min-price" class="w-full p-2.5 pl-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Min">
                </div>
                
                <span class="text-gray-400">-</span>
                
                <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="fas fa-dollar-sign text-gray-400"></i>
                </span>
                <input type="number" id="max-price" class="w-full p-2.5 pl-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Max">
                </div>
                
                <button 
                type="submit"
                class="px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-base font-medium font-['Outfit'] hover:from-blue-700 hover:to-blue-400 transition duration-300"
                >
                    Cari
                </button>
            </div>
            </div>
            
            <div class="flex flex-col gap-3">
            <h3 class="text-lg font-semibold text-gray-800">Status</h3>
            <div class="flex flex-wrap gap-2.5">
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300">
                    Sewa
                </button>
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-800 transition-colors bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300">
                    Beli
                </button>
            </div>
            </div>
            
            <button 
            type="button"
            class="w-full px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-base font-medium font-['Outfit'] hover:from-blue-700 hover:to-blue-400 transition duration-300"
            >
            Tampilkan Hasil
            </button>
                    
        </form>
    </aside>
</template>

<script setup>
// Tidak perlu script
</script>