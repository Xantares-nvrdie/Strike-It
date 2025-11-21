// src/routes/references.js
export default async function (fastify, options) {
    
    // 1. GET Payment Methods
    fastify.get('/payment-methods', async () => {
        const [rows] = await fastify.db.execute('SELECT * FROM payment_methods');
        return rows;
    });

    // 2. GET Memberships
    fastify.get('/memberships', async () => {
        const [rows] = await fastify.db.execute('SELECT * FROM memberships');
        return rows;
    });

    // 3. GET Product Categories
    fastify.get('/categories', async () => {
        const [rows] = await fastify.db.execute('SELECT * FROM category_products');
        return rows;
    });
}
