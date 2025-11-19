<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import avatarImg from '../../assets/user.png';
// Data reaktif untuk profil pengguna
const user = ref({
    name: 'Bintang Fajar Putra Pamungkas',
    tgl_lahir: '25/08/2006',
    kota: 'Bandung',
    bio: 'Halo semua, saya pemancing handal',
    avatar: avatarImg
});

// Data reaktif untuk langganan
const subscription = ref({
    type: 'Jawara Mancing',
    daysLeft: 730,
    benefits: [
        'Diskon 10% untuk sewa alat pancing.',
        'Diskon 20% untuk pembelian umpan.',
        'Pemberian umpan dasar gratis saat kedatangan.',
        'Kesempatan mengikuti turnamen bulanan secara gratis.'
    ]
});

// Data reaktif untuk transaksi
const transactions = ref([
    { id: 1, name: 'Tagihan', date: 'hari/tanggal/tempat', status: 'belum_dibayar', statusText: 'Belum dibayar' },
    { id: 2, name: 'Tagihan', date: 'hari/tanggal/tempat', status: 'lunas', statusText: 'Sudah dibayar' },
    { id: 3, name: 'Tagihan', date: 'hari/tanggal/tempat', status: 'batal', statusText: 'Dibatalkan' },
]);

// Fungsi untuk mendapatkan warna status
const getStatusClass = (status) => {
    switch (status) {
        case 'belum_dibayar': return 'bg-yellow-100 text-yellow-800';
        case 'lunas': return 'bg-green-100 text-green-800';
        case 'batal': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
</script>

<template>
    <section class="w-full h-full bg-zinc-200 flex flex-col justify-start gap-6 o">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-8 py-8">

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline-2 outline-white p-6 flex flex-col gap-5">
                
                <div class="flex flex-col items-center gap-3">
                    <img :src="user.avatar" alt="Avatar" class="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-md">
                    <button class="px-4 py-1.5 bg-white/70 text-blue-900 text-xs font-semibold rounded-full hover:bg-white transition-all backdrop-blur-sm">
                        Upload Photo
                    </button>
                </div>

                <div class="flex flex-col gap-3">
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-xs text-blue-100 font-outfit">Nama</span>
                            <p class="text-white font-medium font-outfit text-lg">{{ user.name }}</p>
                        </div>
                        <button class="p-2 rounded-full hover:bg-black/10 transition-colors">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-xs text-blue-100 font-outfit">Tanggal Lahir</span>
                            <p class="text-white font-medium font-outfit text-lg">{{ user.tgl_lahir }}</p>
                        </div>
                        <button class="p-2 rounded-full hover:bg-black/10 transition-colors">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-xs text-blue-100 font-outfit">Asal Kota</span>
                            <p class="text-white font-medium font-outfit text-lg">{{ user.kota }}</p>
                        </div>
                        <button class="p-2 rounded-full hover:bg-black/10 transition-colors">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="text-xs text-blue-100 font-outfit">Bio</span>
                            <p class="text-white font-medium font-outfit text-lg">{{ user.bio }}</p>
                        </div>
                        <button class="p-2 rounded-full hover:bg-black/10 transition-colors">
                            <Icon icon="heroicons:pencil-20-solid" class="w-5 h-5 text-blue-100" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 from-[#0f172a] via-[#1e1a78] to-[#0f172a] backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22px_rgba(0,0,0,0.13)] outline outline-2 outline-white p-6 flex flex-col gap-4">
                <h2 class="text-2xl font-bold font-outfit text-white">Detail Langganan</h2>

                <div class=" bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-4 rounded-2xl text-white shadow-inner">
                    <span class="block text-xl font-bold font-outfit">{{ subscription.type }}</span>
                    <span class="block text-sm text-blue-100">{{ subscription.daysLeft }} hari tersisa</span>
                </div>

                <div>
                    <h3 class="font-semibold font-outfit text-white text-lg mt-2">Keuntungan dari langganan:</h3>
                    <ul class="space-y-3 mt-3">
                        <li v-for="(benefit, index) in subscription.benefits" :key="index" class="flex items-center gap-3">
                        <div class="flex-shrink-0 bg-green-400 p-1.5 rounded-full">
                            <Icon icon="heroicons:check-20-solid" class="w-5 h-5 text-green-900" />
                        </div>
                        <span class="text-white font-outfit">{{ benefit }}</span>
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
                    <a href="/history" class="text-xs font-semibold font-outfit text-blue-100 uppercase hover:text-white transition-colors">
                        Lihat semua transaksi
                    </a>
                </div>

                <ul class="space-y-3">
                    <li v-for="tx in transactions" :key="tx.id" class="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <div class="flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full" :class="{
                            'bg-yellow-400': tx.status === 'belum_dibayar',
                            'bg-green-400': tx.status === 'lunas',
                            'bg-red-400': tx.status === 'batal'
                        }"></span>
                        <div>
                            <p class="text-white font-medium font-outfit">{{ tx.name }}</p>
                            <span class="text-xs text-blue-100 font-outfit">{{ tx.date }}</span>
                        </div>
                        </div>
                        <span class="text-xs font-medium px-3 py-1 rounded-full" :class="getStatusClass(tx.status)">
                        {{ tx.statusText }}
                        </span>
                    </li>
                </ul>
            </div>

        </div>
    </section>
</template>
