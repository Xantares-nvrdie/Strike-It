<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// State untuk mengontrol tab mana yang aktif
const activeTab = ref('e-wallet'); // 'e-wallet', 'va', 'card'

// State untuk menyimpan pilihan di setiap tab
const selectedEWallet = ref('gopay');
const selectedVA = ref(null);
const creditCardInfo = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
    <h3 class="text-2xl font-medium text-gray-900 mb-6 border-b pb-4">
      Metode Pembayaran
    </h3>

    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          @click="activeTab = 'e-wallet'"
          :class="[
            activeTab === 'e-wallet'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]">
          E-Wallet
        </button>
        <button
          @click="activeTab = 'va'"
          :class="[
            activeTab === 'va'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]">
          Virtual Account
        </button>
        <button
          @click="activeTab = 'card'"
          :class="[
            activeTab === 'card'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]">
          Kartu Kredit/Debit
        </button>
      </nav>
    </div>

    <div>
      <div v-if="activeTab === 'e-wallet'" class="space-y-4">
        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          :class="{'border-blue-600 ring-2 ring-blue-600': selectedEWallet === 'gopay'}">
          <span class="flex items-center gap-3">
            <Icon icon="simple-icons:gopay" class="size-6 text-[#00AEEF]" />
            <span class="font-medium text-gray-900">GoPay</span>
          </span>
          <input type="radio" name="e-wallet" value="gopay" v-model="selectedEWallet" class="h-4 w-4 text-blue-600 border-gray-300">
        </label>
        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          :class="{'border-blue-600 ring-2 ring-blue-600': selectedEWallet === 'ovo'}">
          <span class="flex items-center gap-3">
            <Icon icon="simple-icons:ovo" class="size-6 text-[#4D2E91]" />
            <span class="font-medium text-gray-900">OVO</span>
          </span>
          <input type="radio" name="e-wallet" value="ovo" v-model="selectedEWallet" class="h-4 w-4 text-blue-600 border-gray-300">
        </label>
        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          :class="{'border-blue-600 ring-2 ring-blue-600': selectedEWallet === 'dana'}">
          <span class="flex items-center gap-3">
            <Icon icon="simple-icons:dana" class="size-6 text-[#108EE9]" />
            <span class="font-medium text-gray-900">DANA</span>
          </span>
          <input type="radio" name="e-wallet" value="dana" v-model="selectedEWallet" class="h-4 w-4 text-blue-600 border-gray-300">
        </label>
      </div>

      <div v-if="activeTab === 'va'" class="space-y-4">
        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          :class="{'border-blue-600 ring-2 ring-blue-600': selectedVA === 'bca'}">
          <span class="flex items-center gap-3">
            <Icon icon="simple-icons:bca" class="size-6 text-[#0060A8]" />
            <span class="font-medium text-gray-900">BCA Virtual Account</span>
          </span>
          <input type="radio" name="va" value="bca" v-model="selectedVA" class="h-4 w-4 text-blue-600 border-gray-300">
        </label>
        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          :class="{'border-blue-600 ring-2 ring-blue-600': selectedVA === 'mandiri'}">
          <span class="flex items-center gap-3">
            <Icon icon="simple-icons:bankmandiri" class="size-6 text-[#003D79]" />
            <span class="font-medium text-gray-900">Mandiri Virtual Account</span>
          </span>
          <input type="radio" name="va" value="mandiri" v-model="selectedVA" class="h-4 w-4 text-blue-600 border-gray-300">
        </label>
        </div>

      <div v-if="activeTab === 'card'" class="space-y-4">
        <div>
          <label for="card-number" class="block text-sm font-medium text-gray-700">Nomor Kartu</label>
          <input 
            type="text" 
            id="card-number" 
            v-model="creditCardInfo.number"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0000 0000 0000 0000">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="expiry" class="block text-sm font-medium text-gray-700">Tanggal Kadaluarsa</label>
            <input 
              type="text" 
              id="expiry" 
              v-model="creditCardInfo.expiry"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="MM / YY">
          </div>
          <div>
            <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
            <input 
              type="text" 
              id="cvv" 
              v-model="creditCardInfo.cvv"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="123">
          </div>
        </div>
        <div>
          <label for="card-name" class="block text-sm font-medium text-gray-700">Nama Pemegang Kartu</label>
          <input 
            type="text" 
            id="card-name" 
            v-model="creditCardInfo.name"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nama Sesuai Kartu">
        </div>
      </div>
    </div>
  </div>
</template>