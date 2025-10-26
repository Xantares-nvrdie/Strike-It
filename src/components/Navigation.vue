<template>
    <nav class="flex justify-between items-center px-4 md:px-10 py-4 text-white font-semibold absolute top-0 left-0 w-full z-50">
    <div class="logo">
        <img src="./assets/strikeit_logo.png" alt="Logo Strike It" class="w-12 h-12 object-contain">
    </div>

    <ul class="hidden lg:flex space-x-8">
        <li><button class="btn-glass">Home</button></li>
        <li><button class="btn-glass">Lokasi</button></li>
        <li><button class="btn-glass">Langganan</button></li>
        <li><button class="btn-glass">Penilaian</button></li>
    </ul>

    <ul class="flex items-center space-x-2">
        <li><img src="./assets/saskeh.jpg" alt="Foto Profile" class="w-10 h-10 rounded-full object-cover"></li>
        <li><button class="btn-glass !w-20">Profile</button></li>
    </ul>
    </nav>
</template>

<style scoped>
/* Define the common glass button style */
.btn-glass {
    padding: 10px 5px;
    width: 80px;
    color: #ffffff;
    border: none;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.btn-glass:hover {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}
</style>