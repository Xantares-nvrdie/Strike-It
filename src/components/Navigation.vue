<template>
  <nav class="navbar">
    <div class="logo">
      <img src="../assets/strikeit_logo.png" alt="Logo Strike It" />
    </div>

    <ul class="menu">
      <li><button class="btn-glass">Home</button></li>
      <li><button class="btn-glass">Lokasi</button></li>
      <li><button class="btn-glass">Langganan</button></li>
      <li><button class="btn-glass">Penilaian</button></li>
    </ul>

    <ul class="profile">
      <li><img src="../assets/saskeh.jpg" alt="Foto Profile" /></li>
      <li><button class="btn-glass">Profile</button></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
    color: white;
    font-weight: 600;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
}

.logo img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.menu {
  list-style: none;
  display: flex;
  gap: 30px;
}

.menu li {
  cursor: pointer;
  transition: color 0.3s ease;
}

.menu li:hover {
  color: #122f4f;
}

.profile {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.btn-glass {
font-family: "Outfit", "sans-serif";
  padding: 10px 16px;
  color: #ffffff;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  min-width: 80px;
  text-align: center;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
</style>
