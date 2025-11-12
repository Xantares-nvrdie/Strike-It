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
