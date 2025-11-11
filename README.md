# StrikeIt 🎣

StrikeIt adalah platform comprehensive untuk para penggemar mancing yang menyediakan berbagai layanan mulai dari booking lokasi mancing, komunitas, event, hingga shopping untuk peralatan memancing.

## 🗒️ Catatan
Ini adalah tampilan dari project tahap 3. Semua button sudah ter-link dengan page lainnya.
Pengguna dapat mengakses dengan cepat dengan mengunjungi lama index `http://localhost:5173/`
Untuk melihat router-link lebih lengkap bisa dilihat di router->index.js

## 🚀 Fitur Utama

- **🏞️ Booking Lokasi**: Temukan dan booking lokasi mancing terbaik
- **👥 Komunitas**: Bergabung dengan komunitas pemancing dan sharing pengalaman
- **📅 Event**: Ikuti berbagai event mancing dan turnamen
- **🛒 Shopping**: Beli atau Sewa peralatan memancing berkualitas
- **📱 User Profile**: Kelola profil dan riwayat aktivitas
- **💳 Payment Gateway**: Sistem pembayaran terintegrasi

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Icons**: Iconify Vue
- **Code Quality**: ESLint + Prettier

## 📱 Halaman Aplikasi

- **Landing Page**: Halaman utama dengan overview aplikasi
- **Home**: Dashboard utama dengan berbagai fitur
- **Locations**: Browse dan detail lokasi mancing
- **Booking**: Sistem booking lokasi dengan payment
- **Community**: Forum diskusi dan sharing
- **Events**: Info event dan turnamen
- **Shop**: Toko online peralatan memancing
- **Profile**: Manajemen profil user
- **History**: Riwayat booking dan transaksi

## 🏗️ Struktur Project

```
src/
├── assets/          # Images, styles, dan static files
├── components/      # Komponen Vue yang dapat digunakan kembali
│   ├── Booking/     # Komponen untuk fitur booking
│   ├── Community/   # Komponen untuk forum komunitas
│   ├── Event/       # Komponen untuk event
│   ├── Home/        # Komponen untuk halaman home
│   ├── Layout/      # Komponen layout (Navigation, Footer)
│   ├── Login/       # Komponen autentikasi
│   ├── Profile/     # Komponen profil user
│   └── Shop/        # Komponen toko online
├── router/          # Konfigurasi routing
├── stores/          # Pinia stores untuk state management
└── views/           # Halaman-halaman utama aplikasi
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.19.0 atau v22.12.0+)
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd Strike-It-FrontEnd
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5173`

## 📝 Available Scripts

```bash
# Development server dengan hot reload
npm run dev

# Build untuk production
npm run build

# Preview build hasil
npm run preview

# Linting dengan auto-fix
npm run lint

# Format code dengan Prettier
npm run format
```

## 🔧 Development Setup

### Recommended IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension

**Penting**: Disable ekstensi Vetur jika sudah terinstall untuk menghindari konflik.

### Browser Extensions

**Chromium-based browsers** (Chrome, Edge, Brave):
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Turn on Custom Object Formatter](http://bit.ly/object-formatters)

**Firefox**:
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 🎨 Styling Guidelines

Project ini menggunakan **Tailwind CSS v4** untuk styling. Beberapa guidelines:

- Gunakan utility classes Tailwind untuk styling
- Custom styles ditulis di file CSS terpisah jika diperlukan
- Font utama: "Outfit" (Google Fonts)
- Responsive design untuk semua komponen

## 🏗️ Component Structure

### Layout Components
- `Navigation.vue`: Header navigation
- `Footer.vue`: Footer aplikasi

### Feature Components
Setiap fitur memiliki folder terpisah dengan komponen-komponen terkait:
- Form components
- Card components  
- List components
- Detail components

## 📱 Routing

Aplikasi menggunakan Vue Router dengan struktur:
- `/` - Landing page
- `/home` - Dashboard utama
- `/locations` - Daftar lokasi mancing
- `/booking` - Halaman booking
- `/community` - Forum komunitas
- `/events` - Daftar event
- `/shop` - Toko online
- `/profile` - Profil user

## 🔄 State Management

Menggunakan Pinia untuk state management:
- User authentication state
- Shopping cart state  
- Booking state
- Community posts state

## 📦 Build & Deployment

```bash
# Build untuk production
npm run build

# Files hasil build akan ada di folder 'dist/'
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request
