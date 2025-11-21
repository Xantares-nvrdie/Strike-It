import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './src/config/db.js'; 

// Setup __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const fastify = Fastify({ logger: true });

// --- 1. CEK & BUAT FOLDER UPLOADS (PENTING AGAR GAK CRASH) ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log("Folder 'uploads' berhasil dibuat otomatis.");
}

// --- 2. REGISTER PLUGINS ---
await fastify.register(multipart);

await fastify.register(fastifyStatic, {
    root: uploadDir,
    prefix: '/uploads/', 
});

// Setup CORS (Wajib ada PUT)
await fastify.register(cors, { 
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization']
});

// --- 3. SETUP DATABASE & AUTH ---
fastify.decorate('db', db);

fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'rahasia-super-aman-strike-it'
});

fastify.decorate('authenticate', async function (request, reply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// --- 4. REGISTER ROUTES ---
import usersRoutes from './src/routes/users.js'; 
import productsRoutes from './src/routes/products.js';
import locationsRoutes from './src/routes/locations.js';
import bookingsRoutes from './src/routes/bookings.js';
import ordersRoutes from './src/routes/orders.js';
import referencesRoutes from './src/routes/references.js';
import communityRoutes from './src/routes/community.js';
import reviewsRoutes from './src/routes/reviews.js';
import cartRoutes from './src/routes/cart.js';
import paymentsRoutes from './src/routes/payments.js';
import uploadRoutes from './src/routes/upload.js'; 

fastify.register(usersRoutes);
fastify.register(productsRoutes);
fastify.register(locationsRoutes);
fastify.register(bookingsRoutes);
fastify.register(ordersRoutes);
fastify.register(referencesRoutes);
fastify.register(communityRoutes);
fastify.register(reviewsRoutes);
fastify.register(cartRoutes);
fastify.register(paymentsRoutes);
fastify.register(uploadRoutes);

// --- 5. START SERVER ---
const start = async () => {
    try {
        // Gunakan host: '0.0.0.0' agar terdeteksi oleh semua network (atasi ERR_NETWORK)
        await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
        console.log(`Server running on port ${process.env.PORT || 3000}`);
        console.log(fastify.printRoutes()); // Cek route tree di terminal
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
