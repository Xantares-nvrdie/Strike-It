<script setup>
import { ref, onMounted, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/services/api'; 

// --- STATE ---
const isLoading = ref(true);
const isEditing = ref(false);
const isSaving = ref(false);
const isUploading = ref(false);

// State Modal
const isMembershipModalOpen = ref(false);
const isPaymentModalOpen = ref(false); // State untuk pop-up pembayaran
const memberships = ref([]); 
const selectedPlan = ref(null); // Menyimpan paket yang sedang dipilih untuk dibayar

const fileInput = ref(null);

// Data User
const user = ref({
    name: '',
    tgl_lahir: '',
    kota: 'Indonesia',
    bio: '',
    avatar: '',
    raw_date: ''
});

const editForm = reactive({
    name: '',
    tgl_lahir: '',
    kota: '',
    bio: '',
    avatar: ''
});

const subscription = ref({ type: 'Free User', daysLeft: 0, benefits: [] });
const transactions = ref([]);

// --- 1. FETCH DATA ---
const fetchData = async () => {
    try {
        const [profileRes, memRes, bookingRes] = await Promise.all([
            api.getMyProfile(),
            api.getMemberships(),
            api.getMyBookings()
        ]);

        const profileData = profileRes.data;
        const membershipsData = memRes.data;
        
        memberships.value = membershipsData;

        // A. Setup Data User
        user.value = {
            name: profileData.name,
            tgl_lahir: profileData.date_birth ? new Date(profileData.date_birth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
            raw_date: profileData.date_birth ? new Date(profileData.date_birth).toISOString().split('T')[0] : '',
            kota: 'Indonesia', 
            bio: profileData.bio || 'Belum ada bio',
            avatar: profileData.avatar_img || `https://ui-avatars.com/api/?name=${profileData.name}&background=random`
        };
        
        editForm.avatar = user.value.avatar;

        // B. Setup Langganan
        if (profileData.membership_name) {
            const activePlan = membershipsData.find(m => m.name === profileData.membership_name);
            const rawBenefits = activePlan ? activePlan.benefits : (profileData.membership_desc || '');
            
            const processedBenefits = rawBenefits
                ? rawBenefits.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0)
                : [];

            subscription.value = { 
                type: profileData.membership_name, 
                daysLeft: 30, 
                benefits: processedBenefits 
            };
        } else {
            subscription.value = { type: 'Free User', daysLeft: 0, benefits: [] };
        }

        // C. Setup Transaksi
        transactions.value = bookingRes.data.map(tx => ({
            id: tx.id,
            name: tx.location_name,
            date: new Date(tx.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            status: mapBackendStatus(tx.payment_status),
            statusText: mapStatusText(tx.payment_status)
        }));

    } catch (error) {
        console.error("Gagal ambil data:", error);
    } finally {
        isLoading.value = false;
    }
};

// --- 2. LOGIC PEMBAYARAN (BARU) ---

// Langkah 1: Buka Modal Pembayaran (Simulasi)
const openPaymentModal = (plan) => {
    selectedPlan.value = plan;
    isPaymentModalOpen.value = true;
    // Kita bisa menutup modal pilihan paket agar fokus ke pembayaran, atau biarkan bertumpuk (opsional)
    // isMembershipModalOpen.value = false; 
};

// Langkah 2: Proses 'Bayar' (Panggil API)
const processPayment = async () => {
    if (!selectedPlan.value) return;

    try {
        // Panggil API Upgrade
        await api.upgradeMembership(selectedPlan.value.id);
        
        // Tutup semua modal
        isPaymentModalOpen.value = false;
        isMembershipModalOpen.value = false;
        
        // Refresh data & Feedback
        alert("Pembayaran Berhasil! Paket Anda telah aktif.");
        await fetchData(); 
        
    } catch (error) {
        console.error(error);
        alert("Gagal memproses pembayaran.");
    }
};


// Helper
const isCurrentPlan = (planName) => {
    return planName === subscription.value.type;
};

const formatBenefits = (text) => {
    if (!text) return [];
    return text.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 0);
};

// --- LOGIC UPLOAD & EDIT ---
const triggerFileInput = () => { fileInput.value.click(); };

const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Maksimal 5MB."); return; }

    isUploading.value = true;
    try {
        const res = await api.uploadImage(file);
        const newAvatarUrl = res.data.url; 
        
        const dateToSend = user.value.raw_date === '' ? null : user.value.raw_date;
        await api.updateProfile({
            name: user.value.name, 
            bio: user.value.bio, 
            date_birth: dateToSend, 
            avatar_img: newAvatarUrl
        });
        
        user.value.avatar = newAvatarUrl;
        editForm.avatar = newAvatarUrl;
        alert("Foto berhasil diperbarui!");
    } catch (error) {
        console.error(error);
        alert("Gagal upload foto.");
    } finally {
        isUploading.value = false;
        event.target.value = null; 
    }
};

const toggleEdit = () => {
    if (!isEditing.value) {
        editForm.name = user.value.name;
        editForm.tgl_lahir = user.value.raw_date;
        editForm.kota = user.value.kota;
        editForm.bio = user.value.bio;
        editForm.avatar = user.value.avatar;
    }
    isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
    isSaving.value = true;
    try {
        const dateToSend = editForm.tgl_lahir === '' ? null : editForm.tgl_lahir;
        await api.updateProfile({
            name: editForm.name, 
            bio: editForm.bio, 
            date_birth: dateToSend, 
            avatar_img: editForm.avatar
        });
        isEditing.value = false;
        await fetchData();
        alert("Profil berhasil disimpan!");
    } catch (error) {
        alert("Gagal update profil.");
    } finally {
        isSaving.value = false;
    }
};

const mapBackendStatus = (s) => (s === 'unpaid' ? 'belum_dibayar' : s === 'paid' || s === 'confirmed' ? 'lunas' : 'batal');
const mapStatusText = (s) => (s === 'unpaid' ? 'Belum Dibayar' : s === 'paid' || s === 'confirmed' ? 'Lunas' : 'Dibatalkan');
const getStatusClass = (s) => {
    switch (s) {
        case 'belum_dibayar': return 'bg-yellow-100 text-yellow-800';
        case 'lunas': return 'bg-green-100 text-green-800';
        case 'batal': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};



onMounted(fetchData);
</script>

<template>
    <section class="w-full h-full bg-zinc-200 flex flex-col justify-start gap-6 overflow-y-auto relative">
        
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />

        <div v-if="isLoading" class="w-full h-96 flex items-center justify-center">
            <Icon icon="eos-icons:loading" class="w-10 h-10 text-blue-600 animate-spin" />
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-8 py-8">

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline-2 outline-white p-6 flex flex-col gap-5 relative">
                <button v-if="isEditing" @click="saveProfile" :disabled="isSaving" class="absolute top-6 right-6 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10 hover:bg-green-600 transition">
                    {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
                </button>
                <div class="flex flex-col items-center gap-3">
                    <div class="relative">
                        <img :src="isEditing ? editForm.avatar : user.avatar" alt="Avatar" class="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-md bg-white">
                        <div v-if="isUploading" class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Icon icon="eos-icons:loading" class="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                    <button @click="triggerFileInput" :disabled="isUploading" class="px-4 py-1.5 bg-white/70 text-blue-900 text-xs font-semibold rounded-full hover:bg-white transition-all backdrop-blur-sm disabled:opacity-50 cursor-pointer">
                        {{ isUploading ? 'Mengupload...' : 'Upload Photo' }}
                    </button>
                </div>
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Nama</span>
                            <input v-if="isEditing" v-model="editForm.name" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30" />
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.name }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2"><Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" /></button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Tanggal Lahir</span>
                            <input v-if="isEditing" v-model="editForm.tgl_lahir" type="date" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30" />
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.tgl_lahir }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2"><Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" /></button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Asal Kota</span>
                            <input v-if="isEditing" v-model="editForm.kota" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30" />
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.kota }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2"><Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" /></button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Bio</span>
                            <textarea v-if="isEditing" v-model="editForm.bio" rows="1" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30 resize-none"></textarea>
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.bio }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2"><Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" /></button>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline outline-2 outline-white p-6 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold font-outfit text-white">Detail Langganan</h2>
                    <button @click="isMembershipModalOpen = true" class="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition cursor-pointer">
                        Ganti
                    </button>
                </div>
                <div class="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-4 rounded-2xl text-white shadow-inner relative overflow-hidden">
                    <div class="relative z-10">
                        <span class="block text-xl font-bold font-outfit">{{ subscription.type }}</span>
                        <span v-if="subscription.type !== 'Free User'" class="block text-sm text-white/90 mt-1 font-medium bg-black/10 w-fit px-2 py-0.5 rounded">
                            {{ subscription.daysLeft }} hari tersisa
                        </span>
                        <span v-else class="block text-sm text-white/90 mt-1">
                            Upgrade sekarang untuk akses lebih!
                        </span>
                    </div>
                    <Icon icon="mdi:crown" class="absolute -bottom-4 -right-4 w-24 h-24 text-white/20 rotate-12" />
                </div>
                <div>
                    <h3 class="font-semibold font-outfit text-white text-lg mt-2">Keuntungan saat ini:</h3>
                    <ul class="space-y-2 mt-2">
                        <li v-for="(benefit, index) in subscription.benefits" :key="index" class="flex items-start gap-3">
                            <div class="flex-shrink-0 bg-green-400 p-1 rounded-full mt-0.5">
                                <Icon icon="heroicons:check-20-solid" class="w-4 h-4 text-green-900" />
                            </div>
                            <span class="text-white font-outfit text-sm">{{ benefit }}</span>
                        </li>
                        <li v-if="subscription.benefits.length === 0" class="text-white/70 text-sm italic ml-1">
                            Belum ada keuntungan aktif.
                        </li>
                    </ul>
                </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline outline-2 outline-white p-6 flex flex-col gap-4">
                <h2 class="text-2xl font-bold font-outfit text-white">Akun Pembayaran</h2>
                <div class="bg-white/20 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
                    <div>
                        <span class="text-sm text-blue-100 font-outfit">Pembayaran aktif</span>
                        <p class="text-white font-medium font-outfit text-lg">**** **** **** 1234 (e-wallet)</p>
                    </div>
                    <span class="text-xs bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">Rembesing</span>
                </div>
                <div class="bg-white/20 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
                    <p class="text-white font-medium font-outfit text-lg">Tambahkan Akun</p>
                    <button class="px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-lg text-white text-sm font-medium font-outfit hover:from-blue-700 transition-all">Tambah</button>
                </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline outline-2 outline-white p-6 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold font-outfit text-white">Transaksi anda</h2>
                    <router-link to="/history" class="text-xs font-semibold font-outfit text-blue-100 uppercase hover:text-white transition-colors">Lihat semua transaksi</router-link>
                </div>
                <div v-if="transactions.length === 0" class="text-center text-blue-100 text-sm py-4">Belum ada transaksi.</div>
                <ul v-else class="space-y-3">
                    <li v-for="tx in transactions.slice(0, 3)" :key="tx.id" class="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <span class="w-3 h-3 rounded-full flex-shrink-0" :class="{'bg-yellow-400': tx.status === 'belum_dibayar','bg-green-400': tx.status === 'lunas','bg-red-400': tx.status === 'batal'}"></span>
                            <div class="min-w-0">
                                <p class="text-white font-medium font-outfit truncate max-w-[150px]">{{ tx.name }}</p>
                                <span class="text-xs text-blue-100 font-outfit">{{ tx.date }}</span>
                            </div>
                        </div>
                        <span class="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap" :class="getStatusClass(tx.status)">{{ tx.statusText }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div v-if="isMembershipModalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity" @click.self="isMembershipModalOpen = false">
            <div class="bg-white rounded-3xl w-full max-w-5xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
                
                <div class="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Pilih Paket Langganan</h2>
                        <p class="text-sm text-gray-500 mt-1">Nikmati keuntungan lebih dengan upgrade akun Anda</p>
                    </div>
                    <button @click="isMembershipModalOpen = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                        <Icon icon="mdi:close" class="w-7 h-7" />
                    </button>
                </div>

                <div class="overflow-y-auto p-2 flex-1 pr-2 custom-scrollbar">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
                        <div v-for="plan in memberships" :key="plan.id" 
                                class="border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-xl hover:-translate-y-1 relative bg-white group h-full"
                                :class="[
                                    isCurrentPlan(plan.name) ? 'border-green-500 ring-2 ring-green-100 bg-green-50/50' : (plan.is_popular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200')
                                ]">
                            
                            <div v-if="plan.is_popular && !isCurrentPlan(plan.name)" class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg shadow-sm">
                                POPULAR
                            </div>
                            
                            <div v-if="isCurrentPlan(plan.name)" class="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg shadow-sm flex items-center gap-1">
                                <Icon icon="mdi:check-circle" /> AKTIF
                            </div>

                            <div>
                                <h3 class="text-xl font-bold text-gray-900 font-outfit min-h-[28px] flex items-center">{{ plan.name }}</h3>
                                <p class="text-sm text-gray-500 mt-1 h-[40px] line-clamp-2 leading-tight overflow-hidden">{{ plan.description }}</p>
                            </div>

                            <div class="my-2">
                                <div>
                                    <span class="text-3xl font-bold text-gray-900">Rp {{ Number(plan.price_per_month).toLocaleString('id-ID') }}</span>
                                    <span class="text-gray-500 text-sm font-medium">/bulan</span>
                                </div>
                                <div class="h-8 mt-2 flex items-center">
                                    <div v-if="isCurrentPlan(plan.name) && subscription.type !== 'Free User'" class="text-xs text-green-700 font-medium bg-green-100 px-2 py-1 rounded w-fit">
                                        {{ subscription.daysLeft }} hari tersisa
                                    </div>
                                </div>
                            </div>

                            <button 
                                @click="openPaymentModal(plan)"
                                :disabled="isCurrentPlan(plan.name)"
                                class="w-full py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 mb-2"
                                :class="[
                                    isCurrentPlan(plan.name) 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : (plan.is_popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-blue-500 text-zinc-100 hover:bg-blue-700')
                                ]"
                            >
                                {{ isCurrentPlan(plan.name) ? 'Sedang Aktif' : 'Pilih Paket' }}
                            </button>
                            
                            <div class="border-t border-gray-100 pt-4 mt-auto">
                                <p class="font-semibold text-gray-800 text-sm mb-2">Keuntungan:</p>
                                <ul class="space-y-2">
                                    <li v-for="(line, idx) in formatBenefits(plan.benefits)" :key="idx" class="flex items-start gap-2 text-xs text-gray-600">
                                        <Icon icon="mdi:check-circle" class="w-4 h-4 mt-0.5 shrink-0" :class="isCurrentPlan(plan.name) ? 'text-green-500' : 'text-green-500'"/>
                                        <span>{{ line }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isPaymentModalOpen && selectedPlan" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in" @click.self="isPaymentModalOpen = false">
            <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                
                <div class="text-center mb-6">
                    <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="mdi:credit-card-outline" class="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 font-outfit">Konfirmasi Pembayaran</h3>
                    <p class="text-sm text-gray-500 mt-1">Simulasi pembayaran langganan</p>
                </div>

                <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600">Paket</span>
                        <span class="font-bold text-gray-900">{{ selectedPlan.name }}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600">Metode Bayar</span>
                        <span class="text-sm font-medium text-blue-600">E-Wallet (Simulasi)</span>
                    </div>
                    <div class="border-t border-gray-200 my-2"></div>
                    <div class="flex justify-between items-center">
                        <span class="text-base font-bold text-gray-800">Total</span>
                        <span class="text-xl font-bold text-blue-600">Rp {{ Number(selectedPlan.price_per_month).toLocaleString('id-ID') }}</span>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button @click="isPaymentModalOpen = false" class="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button @click="processPayment" class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95">
                        Bayar / Oke
                    </button>
                </div>
            </div>
        </div>

    </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
