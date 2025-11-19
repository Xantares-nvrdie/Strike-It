import Fastify from 'fastify';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const fastify = Fastify({ logger: true });

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

fastify.decorate('db', db);

import usersRoutes from './routes/users.js';
import productsRoutes from './routes/products.js';
import locationsRoutes from './routes/locations.js';

fastify.register(usersRoutes);
fastify.register(productsRoutes);
fastify.register(locationsRoutes);

console.log(fastify.printRoutes());


await fastify.listen({ port: process.env.PORT });
console.log(`Server running on port ${process.env.PORT}`);
