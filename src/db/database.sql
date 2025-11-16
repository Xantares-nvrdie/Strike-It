CREATE DATABASE strike_it;
USE strike_it;

CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    price_per_month DECIMAL(10,2) NOT NULL,
    benefits TEXT
);

CREATE TABLE category_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_img VARCHAR(255),
    date_birth DATE,
    id_payment_method INT,
    id_membership INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_payment_method) REFERENCES payment_methods(id),
    FOREIGN KEY (id_membership) REFERENCES memberships(id)
);

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    description TEXT,
    address VARCHAR(255),
    price_per_hour DECIMAL(10,2),
    img VARCHAR(255),
    rating_average DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    img VARCHAR(255),
    price DECIMAL(10,2),
    specification TEXT,
    method ENUM('sewa', 'beli') DEFAULT 'beli',
    sold_count INT DEFAULT 0,
    stock INT DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    id_category INT,
    FOREIGN KEY (id_category) REFERENCES category_products(id)
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_location INT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    spot_number INT,
    booking_date DATE,
    booking_start DATETIME,
    booking_end DATETIME,
    duration INT,
    total_price DECIMAL(10,2),
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
    payment_method INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_number VARCHAR(50) UNIQUE,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_location) REFERENCES locations(id),
    FOREIGN KEY (payment_method) REFERENCES payment_methods(id)
);

CREATE TABLE location_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_location INT NOT NULL,
    id_booking INT NOT NULL,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_location) REFERENCES locations(id),
    FOREIGN KEY (id_booking) REFERENCES bookings(id),
    UNIQUE KEY unique_booking_review (id_booking)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    order_number VARCHAR(50) UNIQUE,
    total_amount DECIMAL(10,2),
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    shipping_address VARCHAR(255),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (id_user) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_order) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES products(id)
);

CREATE TABLE product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_product INT NOT NULL,
    id_order_item INT,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_product) REFERENCES products(id),
    FOREIGN KEY (id_order_item) REFERENCES order_items(id)
);

CREATE TABLE shopping_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_product INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_product) REFERENCES products(id),
    UNIQUE KEY unique_cart_item (id_user, id_product)
);

CREATE TABLE community_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    title VARCHAR(100),
    body TEXT,
    category ENUM('general', 'review', 'event', 'discussion'),
    likes_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_post INT NOT NULL,
    id_user INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_post) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES users(id)
);

CREATE TABLE post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_post INT NOT NULL,
    id_user INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_post) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES users(id),
    UNIQUE KEY unique_like (id_post, id_user)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_date ON bookings(id_user, booking_date);
CREATE INDEX idx_orders_user_date ON orders(id_user, created_at);
CREATE INDEX idx_products_category ON products(id_category);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_posts_user_date ON community_posts(id_user, created_at);
CREATE INDEX idx_post_comments_post ON post_comments(id_post);
CREATE INDEX idx_post_likes_post ON post_likes(id_post);

-- Insert sample data into locations table
INSERT INTO locations (name, city, description, address, price_per_hour, img, rating_average, total_reviews)
VALUES 
("Situ Rawa Indah", 
"Jakarta", 
"Suasananya asri dan dikelilingi pepohonan. Karena merupakan fasilitas publik, kelengkapan fasilitasnya tidak seperti kolam pemancingan komersial, namun tetap menjadi favorit untuk bersantai.", 
"Jl. Kh Hasyim Ashari No.125",
15000, 
"locationimg/jakarta.jpg",
4.5,
5),
("Lembah Pancing Citarum",
"Bandung",
"Atmosfernya penuh semangat kompetisi, dengan para pemancing serius yang fokus memantau ujung jorannya. Karena tujuannya adalah perlombaan untuk mendapatkan ikan terberat, fasilitasnya lebih fungsional dan kurang ditujukan untuk rekreasi keluarga. Namun, tempat ini menjadi surga bagi mereka yang mencari tantangan dan sensasi adrenalin saat umpan disambar ikan babon.",
"Jl. Diponegoro No.22, Citarum",
20000,
"locationimg/bandung.png",
4.2,
8),
("Pancingan Tirta Sari",
"Bekasi",
"Suasananya dirancang untuk rekreasi keluarga, sering kali dilengkapi saung lesehan di atas air dan alunan musik yang santai. Karena mengutamakan pengalaman bersantap dan kenyamanan, jenis ikannya mudah dipancing dan sering kali sudah ditentukan untuk langsung diolah. Meskipun begitu, tempat ini adalah pilihan sempurna untuk memperkenalkan hobi memancing kepada anak-anak sambil menikmati akhir pekan bersama.",
"Jl. Pramuka No.59",
25000,
"locationimg/bekasi.png",
4.7,
12),
("Kolam Pancing Nirwana",
"Banten",
"Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Karena benar-benar berada di lokasi liar, aksesnya bisa jadi sulit dan tidak ada jaminan akan mendapatkan ikan. Akan tetapi, di sinilah letak petualangannya, memberikan kepuasan luar biasa saat berhasil mendaratkan ikan asli penghuni perairan tersebut.",
"Jl. Pelelangan Ikan Karangantu",
30000,
"locationimg/banten.png",
4.9,
15),
("Danau Singkarak",
"Tangerang",
"Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Karena benar-benar berada di lokasi liar, aksesnya bisa jadi sulit dan tidak ada jaminan akan mendapatkan ikan. Akan tetapi, di sinilah letak petualangannya, memberikan kepuasan luar biasa saat berhasil mendaratkan ikan asli penghuni perairan tersebut.",
"Jl. Pegangsaan Timur No 55",
18000,
"locationimg/tangerang.jpg",
4.6,
10);

-- Insert sample data into payment_methods table
INSERT INTO payment_methods (name) VALUES 
('Debit Card'),
('Bank Transfer'),
('QRIS'),
('Cash on Delivery');

-- Insert sample data into memberships table
INSERT INTO memberships (name, description, is_popular, price_per_month, benefits) VALUES
('Juragan Mancing', 'Untuk Para Hobiis Sejati, Pilihan Paling Populer.', TRUE, 100000, 
'Anda dapat menghentikan atau membatalkan kapan saja.\n 
Diskon 10% untuk sewa alat pancing.\n
Diskon 20% untuk pembelian umpan.\n
Pemberian umpan dasar gratis saat kedatangan.\n
Kesempatan mengikuti turnamen bulanan secara gratis.'),
('Kawan Mancing', 'Mancing cerdas. Kantong puas.', FALSE, 75000, 
'Anda dapat menghentikan atau membatalkan kapan saja.\n
Diskon 10% untuk sewa alat pancing.\n
Voucher makan di restoran/kantin.\n
Pemberian umpan dasar gratis saat kedatangan.'),
('Jawara Mancing', 'Pengalaman Terbaik, Tanpa Batas dan Tanpa Kompromi.', FALSE, 150000,
'Anda dapat menghentikan atau membatalkan kapan saja.\n
Diskon 10% untuk sewa alat pancing.\n
Diskon 20% untuk pembelian umpan.\n
Kesempatan mengikuti turnamen bulanan secara gratis.\n
Satu sesi konsultasi mingguan dengan pemandu mancing profesional.\n');

-- Insert sample data into category_products table
INSERT INTO category_products (name) VALUES
('Joran'),
('Reel'),
('Umpan'),
('Kail'),
('Senar');

-- Insert sample data into products table
INSERT INTO products (name, description, img, price, specification, method, stock, id_category) VALUES
('Joran Pancing Shimano FX Spinning 210cm',
'Joran pancing spinning berkualitas tinggi dari Shimano, panjang 210cm, cocok untuk berbagai jenis memancing.',
'alatimg/joran1.png',
489000,
'Panjang: 210cm\n
Material: Carbon Fiber\n 
Berat: 150g\n',
'sewa',
10,
1),
('Joran Carbon Fiber 180cm Kuat',
'Joran pancing ini terbuat dari serat karbon berkualitas tinggi, panjang 180cm, dirancang untuk ketahanan dan kekuatan maksimum.',
'alatimg/joran2.png',
399000,
'Panjang: 180cm\n 
Material: Carbon Fiber\n 
Berat: 120g\n',
'sewa',
15,
1),
('Joran Pancing IdrisMaster 240cm',
'Joran pancing panjang 240cm dari IdrisMaster, ideal untuk memancing di laut dan sungai besar.',
'alatimg/joran3.png',
599000,
'Panjang: 240cm\n
Material: Graphite\n 
Berat: 200g\n',
'beli',
8,
1),
('Joran Spinning Abu Garcia Veritas 210cm',
'Joran pancing spinning dari Abu Garcia, panjang 210cm, ringan dan responsif untuk pengalaman memancing yang optimal.',
'alatimg/joran4.png',
529000,
'Panjang: 210cm\n 
Material: Carbon Fiber\n
Berat: 140g\n',
'beli',
12,
1),
('Reel Pancing Shimano Stradic CI4+ 2500',
'Reel pancing berkualitas tinggi dari Shimano, model Stradic CI4+ 2500, ringan dan tahan lama.',
'alatimg/reels1.png',
525000,
'Model: Stradic CI4+ 2500\n 
Material: CI4+\n
Berat: 205g\n',
'beli',
20,
2),
('Reel Daiwa BG 3000',
'Reel pancing Daiwa BG 3000, dirancang untuk kekuatan dan keandalan dalam berbagai kondisi memancing.',
'alatimg/reels2.png',
450000,
'Model: BG 3000\n
Material: Aluminum\n
Berat: 250g\n',
'beli',
18,
2),
('Reel Pancing Okuma Ceymar C-30',
'Reel pancing Okuma Ceymar C-30, ringan dan mudah digunakan, cocok untuk pemancing pemula dan berpengalaman.',
'alatimg/reels3.png',
320000,
'Model: Ceymar C-30\n
Material: Graphite\n
Berat: 220g\n',
'beli',
15,
2),
('Reel Sawunggalih XT-5000',
'Reel pancing Sawunggalih XT-5000, menawarkan performa tinggi dengan desain ergonomis untuk kenyamanan saat memancing.',
'alatimg/reels4.png',
380000,
'Model: XT-5000\n
Material: Aluminum\n
Berat: 240g\n',
'sewa',
15,
2);



-- Insert user sample data
INSERT INTO users (name, email, password, bio, avatar_img, date_birth, id_payment_method, id_membership) VALUES
('Joran_Melengkung', 'joran_melengkung@example.com', 'password123', 'Pecinta mancing sejati.', 'avatar/joran_melengkung.png', '1990-05-15', 1, 1),
('Kang_Asep_Mancing', 'kang_asep_mancing@example.com', 'password456', 'Mancing adalah hidupku.', 'avatar/kang_asep_mancing.png', '1985-08-20', 2, 2),
('Pemula_Casting', 'pemula_casting@example.com', 'password789', 'Saya baru belajar mancing.', 'avatar/pemula_casting.png', '2000-01-01', 1, 1);

-- Insert community posts sample data
INSERT INTO community_posts (id_user, title, body, category) VALUES
(1, 
'Umpan putih andalan untuk ikan mas lagi susah makan?',
'Para suhu, dan rekan angler, mohon pencerahannya. Sudah dua minggu ini saya coba mancing harian ikan mas di kolam langganan, tapi hasilnya boncos terus. Padahal biasanya resep umpan putih andalan saya ini selalu gacor. Saya pakai campuran tepung terigu, dedak halus, dan sedikit pelet ikan mas. Kadang saya tambahkan sedikit aroma vanilla atau pandan biar lebih menggoda. Tapi belakangan ini ikan mas kok kayaknya ogah banget nyambar. Ada yang mengalami hal serupa? Mungkin ada yang punya tips atau modifikasi resep umpan putih biar ikan masnya mau makan lagi? Terima kasih sebelumnya buat sharingnya!',
'umpan'),
(2,
'Laporan mancing di Situ Rawa Indah kemarin',
'Halo rekan-rekan angler! Kemarin saya berkesempatan mancing di Situ Rawa Indah, dan saya ingin berbagi pengalaman serta hasil tangkapan saya. Cuaca cerah dengan angin sepoi-sepoi membuat suasana mancing sangat menyenangkan. Saya menggunakan joran spinning dengan umpan cacing dan pelet ikan mas. Alhamdulillah, dalam waktu 4 jam saya berhasil mendapatkan 5 ekor ikan mas dengan berat bervariasi antara 1 hingga 3 kg. Spot favorit saya adalah di dekat pohon besar di sisi timur danau, di mana banyak ikan berkumpul. Fasilitas di sana juga cukup lengkap, dengan area parkir yang luas dan warung makan yang menyediakan hidangan lezat. Saya sangat merekomendasikan Situ Rawa Indah bagi teman-teman yang ingin menikmati hari memancing yang seru. Jangan lupa bawa peralatan lengkap dan umpan favorit kalian ya! Selamat mancing!',
'laporan mancing'),
(3,
'Rekomendasi reel baitcasting untuk pemula',
'Halo semua! Saya baru saja mulai belajar mancing dengan teknik baitcasting dan sedang mencari rekomendasi reel baitcasting yang cocok untuk pemula. Saya ingin reel yang mudah digunakan, tahan lama, dan tentunya dengan harga yang terjangkau. Apakah ada di antara kalian yang punya pengalaman dengan reel baitcasting tertentu yang bisa direkomendasikan? Mungkin ada merek atau model yang menurut kalian sangat cocok untuk pemula seperti saya. Terima kasih banyak sebelumnya atas sarannya!',
'rekomendasi');

-- Insert post comments sample data
INSERT INTO post_comments (id_post, id_user, content) VALUES
(1, 2, 'Saya juga mengalami hal serupa minggu lalu. Mungkin ikan masnya lagi picky eater nih. Coba tambahkan aroma bawang putih atau keju pada umpan putihnya, biasanya ikan mas suka itu. Semoga berhasil!'),
(2, 3, 'Wah, mantap sekali hasil tangkapannya! Situ Rawa Indah memang tempat favorit saya juga. Terima kasih sudah berbagi pengalaman, jadi makin semangat untuk mancing di sana.'),
(3, 1, 'Untuk pemula, saya rekomendasikan reel baitcasting dari Abu Garcia atau Shimano. Keduanya cukup user-friendly dan punya kualitas yang baik. Pastikan juga untuk latihan casting agar lebih nyaman saat menggunakannya.');

-- Insert post likes sample data
INSERT INTO post_likes (id_post, id_user) VALUES
(1, 3),
(1, 2),
(2, 1),
(2, 3),
(3, 2);

-- Insert product reviews
INSERT INTO product_reviews (id_user, id_product, comment, rating) VALUES
(1, 1, 'Joran Shimano FX Spinning ini sangat ringan dan mudah digunakan. Cocok untuk pemancing pemula seperti saya.', 5),
(2, 5, 'Reel Shimano Stradic CI4+ 2500 ini sangat tangguh dan awet. Saya sudah menggunakannya selama beberapa bulan dan performanya tetap prima.', 4),
(3, 2, 'Joran Carbon Fiber 180cm ini cukup kuat, tapi saya merasa agak berat untuk dibawa saat memancing seharian.', 3),
(1, 6, 'Reel Daiwa BG 3000 ini sangat mudah dioperasikan dan memberikan hasil tangkapan yang memuaskan.', 5),
(2, 3, 'Joran IdrisMaster 240cm ini sangat panjang dan ideal untuk memancing di laut. Saya sangat puas dengan pembelian ini.', 4),
(3, 7, 'Reel Okuma Ceymar C-30 ini cukup ringan dan cocok untuk pemancing pemula. Harganya juga terjangkau.', 4),
(1, 4, 'Joran Abu Garcia Veritas 210cm ini sangat responsif dan nyaman digunakan. Saya sangat merekomendasikannya.', 5),
(2, 8, 'Reel Sawunggalih XT-5000 ini memiliki desain yang ergonomis dan performa yang baik. Sangat cocok untuk berbagai kondisi memancing.', 4);
