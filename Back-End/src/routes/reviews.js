// src/routes/reviews.js
export default async function (fastify, options) {
    
    // POST Review Lokasi (Harus pernah booking? Untuk simplifikasi kita bebaskan dulu asal login)
    fastify.post('/locations/:id/reviews', { onRequest: [fastify.authenticate] }, async (req) => {
        const { rating, comment, id_booking } = req.body; // id_booking wajib sesuai skema DB kamu
        const locationId = req.params.id;
        const userId = req.user.id;

        await fastify.db.execute(
            'INSERT INTO location_reviews (id_user, id_location, id_booking, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [userId, locationId, id_booking, rating, comment]
        );

        return { message: 'Review location submitted' };
    });

    // POST Review Produk
    fastify.post('/products/:id/reviews', { onRequest: [fastify.authenticate] }, async (req) => {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;

        await fastify.db.execute(
            'INSERT INTO product_reviews (id_user, id_product, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, productId, rating, comment]
        );

        return { message: 'Review product submitted' };
    });
    
    // GET Review per Produk
    fastify.get('/products/:id/reviews', async (req) => {
        const [rows] = await fastify.db.execute(`
            SELECT pr.*, u.name, u.avatar_img 
            FROM product_reviews pr
            JOIN users u ON pr.id_user = u.id
            WHERE pr.id_product = ?
        `, [req.params.id]);
        return rows;
    });
}
