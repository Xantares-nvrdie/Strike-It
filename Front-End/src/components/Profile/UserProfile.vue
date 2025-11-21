<script setup>
import { ref, onMounted, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/services/api'; // Pastikan path ini benar ke file api.js

// --- STATE ---
const isLoading = ref(true);
const isEditing = ref(false);
const isSaving = ref(false);
const isUploading = ref(false); // Loading khusus upload foto

// Ref untuk input file tersembunyi
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

// Form Edit
const editForm = reactive({
    name: '',
    tgl_lahir: '',
    kota: '',
    bio: '',
    avatar: ''
});

// Data Lainnya
const subscription = ref({ type: 'Free User', daysLeft: 0, benefits: [] });
const transactions = ref([]);

// --- 1. FETCH DATA ---
const fetchData = async () => {
    try {
        const profileRes = await api.getMyProfile();
        const data = profileRes.data;

        user.value = {
            name: data.name,
            tgl_lahir: data.date_birth ? new Date(data.date_birth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
            raw_date: data.date_birth ? new Date(data.date_birth).toISOString().split('T')[0] : '',
            kota: 'Indonesia', 
            bio: data.bio || 'Belum ada bio',
            avatar: data.avatar_img || `https://ui-avatars.com/api/?name=${data.name}&background=random`
        };

        if (data.membership_name) {
            subscription.value.type = data.membership_name;
            subscription.value.daysLeft = 30; 
            if (data.membership_desc) subscription.value.benefits = [data.membership_desc]; 
        }

        const bookingRes = await api.getMyBookings();
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

// --- 2. LOGIC UPLOAD FILE (FITUR UTAMA) ---
const triggerFileInput = () => {
    // Memicu klik pada input file yang disembunyikan
    fileInput.value.click();
};

const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi ukuran (Maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 5MB.");
        return;
    }

    isUploading.value = true;
    try {
        // A. Upload file fisik ke Backend (/upload)
        // Fungsi ini harus ada di api.js (lihat instruksi sebelumnya)
        const res = await api.uploadImage(file);
        const newAvatarUrl = res.data.url; // Backend mengembalikan URL file lokal

        console.log("Foto berhasil diupload:", newAvatarUrl);

        // B. Simpan URL baru ke Database User (/users/me)
        await api.updateProfile({
            name: user.value.name, // Kirim nama juga agar validasi backend lolos
            bio: user.value.bio,
            date_birth: user.value.raw_date,
            avatar_img: newAvatarUrl
        });

        // C. Update tampilan langsung agar user melihat foto baru
        user.value.avatar = newAvatarUrl;
        editForm.avatar = newAvatarUrl;
        alert("Foto profil berhasil diperbarui!");

    } catch (error) {
        console.error(error);
        alert("Gagal mengupload foto. Pastikan backend server berjalan dan folder 'uploads' ada.");
    } finally {
        isUploading.value = false;
        event.target.value = null; // Reset input file agar bisa pilih file sama lagi
    }
};

// --- 3. LOGIC EDIT DATA ---
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

// --- HELPER ---
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
    <section class="w-full h-full bg-zinc-200 flex flex-col justify-start gap-6 overflow-y-auto">
        
        <!-- INPUT FILE TERSEMBUNYI (Ini kuncinya) -->
        <!-- Ref 'fileInput' dipakai di script untuk memicu klik -->
        <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*" 
            @change="onFileSelected" 
        />

        <div v-if="isLoading" class="w-full h-96 flex items-center justify-center">
            <Icon icon="eos-icons:loading" class="w-10 h-10 text-blue-600 animate-spin" />
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-8 py-8">

            <!-- CARD PROFIL -->
            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline-2 outline-white p-6 flex flex-col gap-5 relative">
                
                <button v-if="isEditing" @click="saveProfile" :disabled="isSaving" class="absolute top-6 right-6 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10 hover:bg-green-600 transition">
                    {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
                </button>

                <div class="flex flex-col items-center gap-3">
                    <div class="relative">
                        <!-- Gambar Profil -->
                        <img :src="isEditing ? editForm.avatar : user.avatar" alt="Avatar" class="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-md bg-white">
                        
                        <!-- Overlay Loading saat upload berjalan -->
                        <div v-if="isUploading" class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Icon icon="eos-icons:loading" class="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                    
                    <!-- TOMBOL UPLOAD (Memanggil triggerFileInput) -->
                    <button 
                        @click="triggerFileInput"
                        :disabled="isUploading" 
                        class="px-4 py-1.5 bg-white/70 text-blue-900 text-xs font-semibold rounded-full hover:bg-white transition-all backdrop-blur-sm disabled:opacity-50 cursor-pointer"
                    >
                        {{ isUploading ? 'Mengupload...' : 'Upload Photo' }}
                    </button>
                </div>

                <div class="flex flex-col gap-3">
                    <!-- NAMA -->
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Nama</span>
                            <input v-if="isEditing" v-model="editForm.name" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30" />
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.name }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>

                    <!-- TANGGAL LAHIR -->
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Tanggal Lahir</span>
                            <input v-if="isEditing" v-model="editForm.tgl_lahir" type="date" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30" />
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.tgl_lahir }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>

                    <!-- KOTA -->
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Asal Kota</span>
                            <input v-if="isEditing" v-model="editForm.kota" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30" />
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.kota }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>

                    <!-- BIO -->
                    <div class="flex justify-between items-center">
                        <div class="w-full">
                            <span class="text-xs text-blue-100 font-outfit">Bio</span>
                            <textarea v-if="isEditing" v-model="editForm.bio" rows="1" class="w-full bg-white/10 text-white font-medium font-outfit text-lg rounded px-2 outline-none border-b border-white/30 resize-none"></textarea>
                            <p v-else class="text-white font-medium font-outfit text-lg">{{ user.bio }}</p>
                        </div>
                        <button @click="toggleEdit" class="p-2 rounded-full hover:bg-black/10 transition-colors ml-2">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- SISA KARTU (Membership, Payment, History) - Tidak Berubah -->
            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline outline-2 outline-white p-6 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold font-outfit text-white">Detail Langganan</h2>
                    <router-link to="/membership" class="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition">Ganti</router-link>
                </div>

                <div class=" bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-4 rounded-2xl text-white shadow-inner">
                    <span class="block text-xl font-bold font-outfit">{{ subscription.type }}</span>
                    <span v-if="subscription.type !== 'Free User'" class="block text-sm text-blue-100">{{ subscription.daysLeft }} hari tersisa</span>
                    <span v-else class="block text-sm text-blue-100">Upgrade sekarang!</span>
                </div>

                <div>
                    <h3 class="font-semibold font-outfit text-white text-lg mt-2">Keuntungan dari langganan:</h3>
                    <ul class="space-y-3 mt-3">
                        <li v-for="(benefit, index) in subscription.benefits" :key="index" class="flex items-center gap-3">
                        <div class="flex-shrink-0 bg-green-400 p-1.5 rounded-full">
                            <Icon icon="heroicons:check-20-solid" class="w-5 h-5 text-green-900" />
                        </div>
                        <span class="text-white font-outfit text-sm">{{ benefit }}</span>
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
                    <button class="px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-lg text-white text-sm font-medium font-outfit hover:from-blue-700 transition-all">
                        Tambah
                    </button>
                </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline outline-2 outline-white p-6 flex flex-col gap-4">
                
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold font-outfit text-white">Transaksi anda</h2>
                    <router-link to="/history" class="text-xs font-semibold font-outfit text-blue-100 uppercase hover:text-white transition-colors">
                        Lihat semua transaksi
                    </router-link>
                </div>

                <div v-if="transactions.length === 0" class="text-center text-blue-100 text-sm py-4">
                    Belum ada transaksi.
                </div>

                <ul v-else class="space-y-3">
                    <li v-for="tx in transactions.slice(0, 3)" :key="tx.id" class="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <span class="w-3 h-3 rounded-full flex-shrink-0" :class="{
                                'bg-yellow-400': tx.status === 'belum_dibayar',
                                'bg-green-400': tx.status === 'lunas',
                                'bg-red-400': tx.status === 'batal'
                            }"></span>
                            <div class="min-w-0">
                                <p class="text-white font-medium font-outfit truncate max-w-[150px]">{{ tx.name }}</p>
                                <span class="text-xs text-blue-100 font-outfit">{{ tx.date }}</span>
                            </div>
                        </div>
                        <span class="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap" :class="getStatusClass(tx.status)">
                        {{ tx.statusText }}
                        </span>
                    </li>
                </ul>
            </div>

        </div>
    </section>
</template>
