<template>
    <section class="profile-section">

        <div class="deskripsi">
            <h1>Strike It</h1>
            <p>
                Kami adalah komunitas pemancing yang berdedikasi untuk menciptakan pengalaman memancing yang
                menyenangkan.
                Kami percaya bahwa memancing adalah sebuah proses dan perjalanan, bukan sekadar hasil tangkapan.
                Misi kami adalah membantu Anda menciptakan kenangan berharga yang akan bertahan seumur hidup.
            </p>
            <button class="btn-book">Book Sekarang</button>
            <button class="btn-rent">Sewa Alat</button>
        </div>
        <div class="img-pemancing"></div>
        <div class="wave"></div>
    </section>
</template>

<style>
.profile-section {
    position: relative;
    min-width: 100vw;
    min-height: 100vh;
    background: linear-gradient(to bottom, #0768a0, #ffffff);
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 0;
    padding: 50px;
}

.wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30dvh;

    /* Gunakan properti spesifik untuk menghindari konflik */
    background-image: url('../assets/wave1.png');
    background-repeat: repeat-x;
    background-size: cover;

    z-index: 2;
}

.img-pemancing {
    width: 70vw;
    height: 70dvh;
    background-size: cover;
    background-position: center;
    z-index: 1;
    background-image: url('../assets/mancing2.png');
}

/* Text section */
.profile-section .deskripsi {
    position: absolute;
    top: 50%;
    left: 50px;
    transform: translateY(-50%);
    /* background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px); */
    color: white;
    border-radius: 20px;
    padding: 10px 20px;
    width: 400px;
    z-index: 999;
    box-sizing: border-box;
    margin-left: 5dvh;
}

.profile-section .deskripsi h1 {
    font-family: "Outfit", sans-serif;
    font-weight: 700;
    font-size: 5em;
    margin-bottom: 20px;
}

.deskripsi p {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 30px;
    color: #f1f1f1;
}

/* Buttons */
.btn-book,
.btn-rent {
    font-family: "Outfit", sans-serif;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 16px;
    border: 1px solid transparent;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    margin-right: 10px;
}

.btn-book {
    background-color: #2563eb;
    /* Blue */
}

.btn-book:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
}

.btn-rent {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-rent:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}
</style>
