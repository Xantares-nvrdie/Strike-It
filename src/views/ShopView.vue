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
// ... tambahkan category: 'joran' ke sisanya
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
                            displayMode="grid"
                        />
                        <ProductList 
                            title="Reels Pancing" 
                            :products="reelProducts" 
                            categorySlug="reels" 
                            displayMode="grid"
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

