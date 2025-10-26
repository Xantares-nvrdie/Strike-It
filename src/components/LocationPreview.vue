<template>
    <section class="preview">
        <div class="container-deskripsi-preview">
            <span class="heading-preview">Lokasi Tempat Pemancingan</span>
            <p class="deskripsi-preview">Jelajahi destinasi pemancingan terbaik di sekitar Anda.
                Temukan tempat favorit baru untuk petualangan memancing Anda selanjutnya, mulai dari kolam harian hingga galatama.
            </p>
        </div>
        <div class="container-list-preview">
            <ul class="list-preview">
                <li><button class="btn-prev"><img src="../assets/left-arrow.png" alt="left-arrow"></button></li>
                <li><button class="btn-preview">Jakarta</button></li>
                <li><button class="btn-preview">Bandung</button></li>
                <li><button class="btn-preview">Bekasi</button></li>
                <li><button class="btn-preview">Bogor</button></li>
                <li><button class="btn-preview">Banten</button></li>
                <li><button class="btn-next"><img src="../assets/right-arrow.png" alt="right-arrow"></button></li>
            </ul>
        </div>

        <div class="container-img-preview">
            <img src="../assets/preview.webp" alt="preview" class="preview">
            <button class="btn-book-preview">Booking Sekarang</button>
        </div>
    </section>
</template>

<script setup>
// Logika untuk navigasi list lokasi atau mengganti gambar preview diletakkan di sini.
</script>

<style scoped>
/* Pindahkan gaya CSS untuk section.preview, .list-preview, dll. */
</style>