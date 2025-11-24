// Front-End/src/components/Shop/__tests__/ProductDetails.spec.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductDetails from '../ProductDetails.vue'; 
import { nextTick } from 'vue';

// --- MOCKING ---

// 1. Mock Vue Router (untuk meniru useRouter/useRoute)
const mockRouterPush = vi.fn();
    vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockRouterPush
    }),
    useRoute: () => ({
        params: { id: 'test-id' }, // Mock product ID
        query: {}
    })
}));

// 2. Mock API Service
const mockApi = {
    getProductDetail: vi.fn(),
    addToCart: vi.fn(),
    login: vi.fn()
};
vi.mock('@/services/api', () => ({ default: mockApi }));

// 3. Mock Toast & Alert (untuk fungsi handleSewaShowcase)
global.alert = vi.fn(); 
const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('vue-toastification', () => ({ useToast: () => mockToast }));

// --- DUMMY DATA ---
const dualPurposeProduct = { id: 1, name: 'Joran Dual', price_sale: 100000, price_rent: 50000, stock: 5, description: 'Dual' };
const rentOnlyProduct = { id: 2, name: 'Joran Sewa', price_sale: 0, price_rent: 50000, stock: 100, description: 'Rent Only' };
const buyOnlyProduct = { id: 3, name: 'Umpan Beli', price_sale: 20000, price_rent: 0, stock: 10, description: 'Buy Only' };


describe('ProductDetails.vue: Logic Transaksi', () => {
    
    it('harus merender tombol Beli dan Sewa jika produk dual-purpose', async () => {
        mockApi.getProductDetail.mockResolvedValue({ data: dualPurposeProduct });
        const wrapper = mount(ProductDetails);
        await nextTick(); // Tunggu data terload
        
        // Cek harga
        expect(wrapper.text()).toContain('Rp. 100.000');
        expect(wrapper.text()).toContain('Rp. 50.000');
        
        // Cek tombol
        const beliButton = wrapper.findAll('button').find(btn => btn.text().includes('Beli Sekarang'));
        const sewaButton = wrapper.findAll('button').find(btn => btn.text().includes('Sewa Sekarang'));

        expect(beliButton.exists()).toBe(true);
        expect(sewaButton.exists()).toBe(true);
    });
    
    // --- TEST UTAMA: SEWA SHOWCASE ---
    it('harus menampilkan ALERT SHOWCASE jika produk hanya untuk sewa (rent-only)', async () => {
        mockApi.getProductDetail.mockResolvedValue({ data: rentOnlyProduct });
        const wrapper = mount(ProductDetails);
        await nextTick(); 
        
        const infoSewaButton = wrapper.findAll('button').find(btn => btn.text().includes('Informasi Sewa'));
        
        // Tombol Sewa harus ada
        expect(infoSewaButton.exists()).toBe(true);
        
        // Klik tombol sewa
        await infoSewaButton.trigger('click');
        
        // Cek: Alert global dipanggil (Showcase Logic)
        expect(global.alert).toHaveBeenCalled();
        
        // Cek: Router tidak dipanggil (Tidak redirect ke checkout)
        expect(mockRouterPush).not.toHaveBeenCalled();
        
        // Cek: API addToCart tidak dipanggil
        expect(mockApi.addToCart).not.toHaveBeenCalled();
    });

    it('harus redirect ke checkout saat klik Beli Sekarang (buy-only)', async () => {
        mockApi.getProductDetail.mockResolvedValue({ data: buyOnlyProduct });
        mockApi.addToCart.mockResolvedValue({}); // Sukses add to cart
        const wrapper = mount(ProductDetails);
        await nextTick(); 
        
        const beliButton = wrapper.findAll('button').find(btn => btn.text().includes('Beli Sekarang'));
        
        await beliButton.trigger('click');
        
        // Cek: API addToCart dipanggil
        expect(mockApi.addToCart).toHaveBeenCalledWith({
            id_product: buyOnlyProduct.id,
            quantity: 1,
            transaction_type: 'beli'
        });

        // Cek: Redirect ke checkout
        expect(mockRouterPush).toHaveBeenCalledWith('/shop/checkout');
    });   

});
