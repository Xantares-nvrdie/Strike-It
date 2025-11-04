<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ShopHeader from '../components/Shop/ShopHeader.vue';
import FilterSidebar from '../components/Shop/FilterSidebar.vue';
import ProductList from '../components/Shop/ProductList.vue';

const joranProducts = ref([
{
    id: 1,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+1',
    name: 'Joran Pancing Shimano FX Spinning 210cm',
    rating: 4,
    sold: 245,
    price: 'Rp 489.000',
    isForRent: true,
    isForSale: true
},
{
    id: 2,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+2',
    name: 'Joran Carbon Fiber 180cm Kuat',
    rating: 5,
    sold: 178,
    price: 'Rp 350.000',
    isForRent: true,
    isForSale: false
},
{
    id: 5,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+3',
    name: 'Joran Pancing Telescopic 150cm',
    rating: 3,
    sold: 95,
    price: 'Rp 220.000',
    isForRent: false,
    isForSale: true
},
{
    id: 6,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+4',
    name: 'Joran Spinning Abu Garcia Veritas 2.0',
    rating: 4,
    sold: 130,
    price: 'Rp 600.000',
    isForRent: true,
    isForSale: true
},
{
    id: 7,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+5',
    name: 'Joran Pancing Fiber Glass 200cm',
    rating: 2,
    sold: 60,
    price: 'Rp 180.000',
    isForRent: false,
    isForSale: true
},
{
    id: 8,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+6',
    name: 'Joran Pancing Telescopic 240cm',
    rating: 5,
    sold: 300,
    price: 'Rp 750.000',
    isForRent: true,
    isForSale: true
},
{
    id: 9,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+7',
    name: 'Joran Pancing Spinning Carbon 210cm',
    rating: 4,
    sold: 220,
    price: 'Rp 520.000',
    isForRent: true,
    isForSale: false
},
{
    id: 10,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+8',
    name: 'Joran Pancing Fiber Glass 180cm',
    rating: 3,
    sold: 110,
    price: 'Rp 300.000',
    isForRent: false,
    isForSale: true
},
{
    id: 11,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+9',
    name: 'Joran Pancing Spinning Abu Garcia Veritas 1.5',
    rating: 4,
    sold: 150,
    price: 'Rp 450.000',
    isForRent: true,
    isForSale: true
},
{
    id: 12,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+10',
    name: 'Joran Pancing Telescopic 210cm',
    rating: 5,
    sold: 280,
    price: 'Rp 680.000',
    isForRent: true,
    isForSale: true
},
{    id: 13,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+11',
    name: 'Joran Pancing Carbon Fiber 200cm',
    rating: 4,
    sold: 200,
    price: 'Rp 550.000',
    isForRent: true,
    isForSale: false
},
{
    id: 14,
    category: 'joran',
    imageUrl: 'https://placehold.co/220x200/3B82F6/FFFFFF?text=Joran+12',
    name: 'Joran Pancing Spinning 240cm Kuat',
    rating: 5,
    sold: 320,
    price: 'Rp 800.000',
    isForRent: true,
    isForSale: true
},
]);

const reelProducts = ref([
{
    id: 3,
    category: 'reels',
    imageUrl: 'https://placehold.co/220x200/10B981/FFFFFF?text=Reel+1',
    name: 'Reel Pancing Shimano Sienna 4000',
    rating: 5,
    sold: 512,
    price: 'Rp 550.000',
    isForRent: true,
    isForSale: true
},
{
    id: 4,
    category: 'reels',
    imageUrl: 'https://placehold.co/220x200/10B981/FFFFFF?text=Reel+2',
    name: 'Reel Daiwa Crossfire 3000',
    rating: 4,
    sold: 320,
    price: 'Rp 420.000',
    isForRent: false,
    isForSale: true
},
// ... tambahkan category: 'reels' ke sisanya
]);

const allProducts = ref([
    ...joranProducts.value,
    ...reelProducts.value
]);

const route = useRoute();

const currentCategory = computed(() => route.params.categorySlug);

const filteredProducts = computed(() => {
    if (currentCategory.value) { 
        return allProducts.value.filter(p => p.category === currentCategory.value);
    }
    return [];
});

const pageTitle = computed(() => {
    if (currentCategory.value === 'joran') return 'Joran';
    if (currentCategory.value === 'reels') return 'Reels Pancing';
    return 'Produk';
});

</script>

<template>
    <div class="relative w-full min-h-screen overflow-x-hidden bg-zinc-100">
        
        <ShopHeader class="w-full sticky top-[65px] z-40 bg-zinc-100 py-4" />

        <div class="w-full p-2.5 flex flex-col justify-start items-stretch gap-20 relative z-30 mt-4">
            <div class="self-stretch flex flex-col lg:flex-row justify-start items-start gap-2.5">
                <FilterSidebar class="w-full lg:w-80 flex-shrink-0 sticky top-[12rem] z-20" />
                
                <main class="flex-1 min-w-0 inline-flex flex-col justify-start items-start gap-2.5">
                    
                    <div v-if="!currentCategory" class="w-full flex flex-col gap-2.5">
                        <ProductList 
                            title="Joran" 
                            :products="joranProducts" 
                            categorySlug="joran"
                            displayMode="row"
                        />
                        <ProductList 
                            title="Reels Pancing" 
                            :products="reelProducts" 
                            categorySlug="reels" 
                            displayMode="row"
                        />
                    </div>
                    
                    <div v-else class="w-full">
                        <ProductList 
                            :title="pageTitle" 
                            :products="filteredProducts" 
                            :categorySlug="currentCategory" 
                            displayMode="grid" 
                        />
                    </div>
                    
                </main>

            </div>
            
        </div>
    </div>
</template>

