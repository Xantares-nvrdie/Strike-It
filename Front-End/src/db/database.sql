CREATE DATABASE IF NOT EXISTS strike_it;
USE strike_it;

-- ==========================================
-- 1. TABLES DEFINITION
-- ==========================================

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
    img VARCHAR(255), -- Cover Image (Main)
    lat DECIMAL(10, 8) DEFAULT NULL, -- Latitude untuk Peta
    lng DECIMAL(11, 8) DEFAULT NULL, -- Longitude untuk Peta
    rating_average DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0
);

-- Tabel Baru: Location Images (Gallery)
CREATE TABLE location_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_location INT NOT NULL,
    img_path VARCHAR(255) NOT NULL,
    img_type ENUM('main', 'gallery') DEFAULT 'gallery',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_location) REFERENCES locations(id) ON DELETE CASCADE
);

-- Tabel Baru: Location Spots (Kursi/Spot)
CREATE TABLE location_spots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_location INT NOT NULL,
    spot_name VARCHAR(10) NOT NULL, -- T1, B2, dll
    spot_type VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_location) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_spot_per_location (id_location, spot_name)
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
    spot_number VARCHAR(10), -- Update: Ubah ke VARCHAR agar bisa simpan 'T1'
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
    category ENUM('general', 'review', 'event', 'discussion', 'umpan', 'piranti', 'laporan mancing', 'tips & trik'),
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
    likes_count INT DEFAULT 0, -- Tambahan Likes Count
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

CREATE TABLE comment_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_comment INT NOT NULL,
    id_user INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_comment) REFERENCES post_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES users(id),
    UNIQUE KEY unique_comment_like (id_comment, id_user)
);

CREATE TABLE discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discount_value VARCHAR(50) NOT NULL, 
    code VARCHAR(50) NOT NULL,           
    used_count INT DEFAULT 0,            
    max_usage INT DEFAULT 100            
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    img VARCHAR(255) NOT NULL,
    link_url TEXT
);

-- INDEXING
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_date ON bookings(id_user, booking_date);
CREATE INDEX idx_orders_user_date ON orders(id_user, created_at);
CREATE INDEX idx_products_category ON products(id_category);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_posts_user_date ON community_posts(id_user, created_at);
CREATE INDEX idx_post_comments_post ON post_comments(id_post);
CREATE INDEX idx_post_likes_post ON post_likes(id_post);


-- ==========================================
-- 2. SEEDING DATA
-- ==========================================

INSERT INTO discounts (discount_value, code, used_count, max_usage) VALUES 
('15%', 'AASNAAD998', 122, 130),
('15%', 'ASD12229SDA', 122, 130),
('15%', 'ADAD9988', 122, 130);

INSERT INTO events (name, img, link_url) VALUES 
('Lomba Mancing Bakti Forkabi Untuk Negeri', '/eventimg/poster1.png', 'https://drive.google.com/'),
('Lomba Mancing HUT RI Ke-74 Warga Garon', '/eventimg/poster2.png', 'https://drive.google.com/'),
('Lomba Mancing Karang Taruna Taanimulya', '/eventimg/poster3.png','https://drive.google.com/');

-- Insert Locations (Lengkap dengan Lat/Lng)
INSERT INTO locations (name, city, description, address, price_per_hour, img, lat, lng, rating_average, total_reviews)
VALUES 
("Situ Rawa Indah", 
"Jakarta", 
"Suasananya asri dan dikelilingi pepohonan. Karena merupakan fasilitas publik, kelengkapan fasilitasnya tidak seperti kolam pemancingan komersial, namun tetap menjadi favorit untuk bersantai.", 
"Jl. Kh Hasyim Ashari No.125",
15000, 
"locationimg/jakarta.jpg",
-6.200000, 106.816666,
4.5,
5),
("Lembah Pancing Citarum",
"Bandung",
"Atmosfernya penuh semangat kompetisi, dengan para pemancing serius yang fokus memantau ujung jorannya. Karena tujuannya adalah perlombaan untuk mendapatkan ikan terberat, fasilitasnya lebih fungsional.",
"Jl. Diponegoro No.22, Citarum",
20000,
"locationimg/bandung.png",
-6.917500, 107.619100,
4.2,
8),
("Pancingan Tirta Sari",
"Bekasi",
"Suasananya dirancang untuk rekreasi keluarga, sering kali dilengkapi saung lesehan di atas air dan alunan musik yang santai. Tempat ini adalah pilihan sempurna untuk keluarga.",
"Jl. Pramuka No.59",
25000,
"locationimg/bekasi.png",
-6.238300, 106.975600,
4.7,
12),
("Kolam Pancing Nirwana",
"Banten",
"Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air dan serangga hutan. Aksesnya bisa jadi sulit tapi petualangannya luar biasa.",
"Jl. Pelelangan Ikan Karangantu",
30000,
"locationimg/banten.png",
-6.120000, 106.150000,
4.9,
15),
("Danau Singkarak",
"Tangerang",
"Suasananya hening dan menyatu dengan alam, seringkali hanya ditemani suara aliran air. Tempat yang cocok untuk mencari ketenangan.",
"Jl. Pegangsaan Timur No 55",
18000,
"locationimg/tangerang.jpg",
-6.178300, 106.631900,
4.6,
10);

-- Insert Location Images (Gallery) untuk Lokasi 1 (Jakarta)
INSERT INTO location_images (id_location, img_path, img_type) VALUES 
(1, 'locationimg/jakarta.jpg', 'main'),
(1, 'locationimg/jakarta_thumb1.jpg', 'gallery'),
(1, 'locationimg/jakarta_thumb2.jpg', 'gallery');

-- Insert Spots untuk Lokasi 1 (Jakarta)
INSERT INTO location_spots (id_location, spot_name, spot_type) VALUES 
(1, 'T1', 'general'), (1, 'T2', 'general'), (1, 'T3', 'general'),
(1, 'T4', 'general'), (1, 'T5', 'general'), (1, 'T6', 'general'),
(1, 'T7', 'general'), (1, 'T8', 'general'), (1, 'T9', 'general'),
(1, 'B1', 'general'), (1, 'B2', 'general'), (1, 'B3', 'general'),
(1, 'B4', 'general'), (1, 'B5', 'general'), (1, 'B6', 'general'),
(1, 'B7', 'general'), (1, 'B8', 'general'), (1, 'B9', 'general'),
(1, 'L1', 'general'), (1, 'L2', 'general'), (1, 'L3', 'general'),
(1, 'R1', 'general'), (1, 'R2', 'general'), (1, 'R3', 'general');

-- Payment Methods
INSERT INTO payment_methods (name) VALUES ('Debit Card'), ('Bank Transfer'), ('QRIS'), ('Cash on Delivery');

-- Memberships
INSERT INTO memberships (name, description, is_popular, price_per_month, benefits) VALUES
('Juragan Mancing', 'Untuk Para Hobiis Sejati.', TRUE, 100000, 'Benefit A, Benefit B'),
('Kawan Mancing', 'Mancing cerdas. Kantong puas.', FALSE, 75000, 'Benefit C'),
('Jawara Mancing', 'Pengalaman Terbaik.', FALSE, 150000, 'Benefit D');

-- Categories
INSERT INTO category_products (name) VALUES ('Joran'), ('Reel'), ('Umpan'), ('Kail'), ('Senar');

-- Products
INSERT INTO products (name, description, img, price, specification, method, stock, id_category) VALUES
('Joran Shimano FX', 'Joran berkualitas', 'alatimg/joran1.png', 489000, 'Spec A', 'sewa', 10, 1),
('Reel Daiwa BG', 'Reel kuat', 'alatimg/reels2.png', 450000, 'Spec B', 'beli', 18, 2);

-- Users
INSERT INTO users (name, email, password, bio, avatar_img, id_payment_method, id_membership) VALUES
('Joran_Melengkung', 'joran_melengkung@example.com', 'pass123', 'Hobi mancing', 'avatar/joran_melengkung.png', 1, 1),
('Kang_Asep_Mancing', 'kang_asep_mancing@example.com', 'pass456', 'Mancing mania', 'avatar/kang_asep_mancing.png', 2, 2),
('Pemula_Casting', 'pemula_casting@example.com', 'pass789', 'Newbie', 'avatar/pemula_casting.png', 1, 1);

-- Community Posts
INSERT INTO community_posts (id_user, title, body, category) VALUES
(1, 'Umpan putih andalan?', 'Mohon pencerahannya suhu...', 'umpan'),
(2, 'Laporan mancing di Situ Rawa Indah', 'Hasil tangkapan lumayan...', 'laporan mancing');

-- Reviews & Bookings Logic (Contoh Transaksi Selesai + Review)
-- 1. Booking & Review: Jayesh
INSERT INTO users (name, email, password, avatar_img, id_payment_method, id_membership) 
VALUES ('Jayesh Patil', 'jayesh.patil@dummy.com', 'pass123', 'https://placehold.co/40x40/FF7F50/FFFFFF/png?text=JP', 1, 1);
SET @uid = LAST_INSERT_ID();
INSERT INTO bookings (id_user, id_location, spot_number, booking_date, booking_start, booking_end, duration, total_price, status, payment_status, payment_method) 
VALUES (@uid, 1, 'T1', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 5 DAY), INTERVAL 2 HOUR), 2, 30000, 'completed', 'paid', 1);
SET @bid = LAST_INSERT_ID();
INSERT INTO location_reviews (id_user, id_location, id_booking, comment, rating, created_at) 
VALUES (@uid, 1, @bid, "Layanan luar biasa!", 5, NOW());

-- 2. Booking & Review: Dina
INSERT INTO users (name, email, password, avatar_img, id_payment_method, id_membership) 
VALUES ('Dina Sari', 'dina.sari@dummy.com', 'pass123', 'https://placehold.co/40x40/90EE90/FFFFFF/png?text=DS', 1, 1);
SET @uid = LAST_INSERT_ID();
INSERT INTO bookings (id_user, id_location, spot_number, booking_date, booking_start, booking_end, duration, total_price, status, payment_status, payment_method) 
VALUES (@uid, 1, 'B5', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_SUB(NOW(), INTERVAL 2 DAY), INTERVAL 3 HOUR), 3, 45000, 'completed', 'paid', 1);
SET @bid = LAST_INSERT_ID();
INSERT INTO location_reviews (id_user, id_location, id_booking, comment, rating, created_at) 
VALUES (@uid, 1, @bid, "Tempatnya nyaman.", 4, NOW());


USE strike_it;

-- Gambar untuk Lokasi 2 (Bandung)
INSERT INTO location_images (id_location, img_path, img_type) VALUES 
(2, 'locationimg/bandung.png', 'main'),
(2, 'locationimg/jakarta.jpg', 'gallery'), -- Dummy: Pinjam gambar jakarta
(2, 'locationimg/bekasi.png', 'gallery');  -- Dummy: Pinjam gambar bekasi

-- Gambar untuk Lokasi 3 (Bekasi)
INSERT INTO location_images (id_location, img_path, img_type) VALUES 
(3, 'locationimg/bekasi.png', 'main'),
(3, 'locationimg/bandung.png', 'gallery'),
(3, 'locationimg/banten.png', 'gallery');

-- Gambar untuk Lokasi 4 (Banten)
INSERT INTO location_images (id_location, img_path, img_type) VALUES 
(4, 'locationimg/banten.png', 'main'),
(4, 'locationimg/tangerang.jpg', 'gallery'),
(4, 'locationimg/jakarta.jpg', 'gallery');

-- Gambar untuk Lokasi 5 (Tangerang)
INSERT INTO location_images (id_location, img_path, img_type) VALUES 
(5, 'locationimg/tangerang.jpg', 'main'),
(5, 'locationimg/banten.png', 'gallery'),
(5, 'locationimg/bandung.png', 'gallery');

USE strike_it;

-- =============================================
-- ISI KURSI UNTUK LOKASI 2 (BANDUNG)
-- =============================================
INSERT INTO location_spots (id_location, spot_name, spot_type) VALUES 
(2, 'T1', 'general'), (2, 'T2', 'general'), (2, 'T3', 'general'), (2, 'T4', 'general'), (2, 'T5', 'general'),
(2, 'T6', 'general'), (2, 'T7', 'general'), (2, 'T8', 'general'), (2, 'T9', 'general'),
(2, 'B1', 'general'), (2, 'B2', 'general'), (2, 'B3', 'general'), (2, 'B4', 'general'), (2, 'B5', 'general'),
(2, 'B6', 'general'), (2, 'B7', 'general'), (2, 'B8', 'general'), (2, 'B9', 'general'),
(2, 'L1', 'general'), (2, 'L2', 'general'), (2, 'L3', 'general'),
(2, 'R1', 'general'), (2, 'R2', 'general'), (2, 'R3', 'general');

-- =============================================
-- ISI KURSI UNTUK LOKASI 3 (BEKASI)
-- =============================================
INSERT INTO location_spots (id_location, spot_name, spot_type) VALUES 
(3, 'T1', 'general'), (3, 'T2', 'general'), (3, 'T3', 'general'), (3, 'T4', 'general'), (3, 'T5', 'general'),
(3, 'T6', 'general'), (3, 'T7', 'general'), (3, 'T8', 'general'), (3, 'T9', 'general'),
(3, 'B1', 'general'), (3, 'B2', 'general'), (3, 'B3', 'general'), (3, 'B4', 'general'), (3, 'B5', 'general'),
(3, 'B6', 'general'), (3, 'B7', 'general'), (3, 'B8', 'general'), (3, 'B9', 'general'),
(3, 'L1', 'general'), (3, 'L2', 'general'), (3, 'L3', 'general'),
(3, 'R1', 'general'), (3, 'R2', 'general'), (3, 'R3', 'general');

-- =============================================
-- ISI KURSI UNTUK LOKASI 4 (BANTEN)
-- =============================================
INSERT INTO location_spots (id_location, spot_name, spot_type) VALUES 
(4, 'T1', 'general'), (4, 'T2', 'general'), (4, 'T3', 'general'), (4, 'T4', 'general'), (4, 'T5', 'general'),
(4, 'T6', 'general'), (4, 'T7', 'general'), (4, 'T8', 'general'), (4, 'T9', 'general'),
(4, 'B1', 'general'), (4, 'B2', 'general'), (4, 'B3', 'general'), (4, 'B4', 'general'), (4, 'B5', 'general'),
(4, 'B6', 'general'), (4, 'B7', 'general'), (4, 'B8', 'general'), (4, 'B9', 'general'),
(4, 'L1', 'general'), (4, 'L2', 'general'), (4, 'L3', 'general'),
(4, 'R1', 'general'), (4, 'R2', 'general'), (4, 'R3', 'general');

-- =============================================
-- ISI KURSI UNTUK LOKASI 5 (TANGERANG)
-- =============================================
INSERT INTO location_spots (id_location, spot_name, spot_type) VALUES 
(5, 'T1', 'general'), (5, 'T2', 'general'), (5, 'T3', 'general'), (5, 'T4', 'general'), (5, 'T5', 'general'),
(5, 'T6', 'general'), (5, 'T7', 'general'), (5, 'T8', 'general'), (5, 'T9', 'general'),
(5, 'B1', 'general'), (5, 'B2', 'general'), (5, 'B3', 'general'), (5, 'B4', 'general'), (5, 'B5', 'general'),
(5, 'B6', 'general'), (5, 'B7', 'general'), (5, 'B8', 'general'), (5, 'B9', 'general'),
(5, 'L1', 'general'), (5, 'L2', 'general'), (5, 'L3', 'general'),
(5, 'R1', 'general'), (5, 'R2', 'general'), (5, 'R3', 'general');
