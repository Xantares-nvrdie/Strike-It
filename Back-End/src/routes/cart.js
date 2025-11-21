// src/routes/cart.js
export default async function (fastify, options) {

    // GET Keranjang Saya
    fastify.get('/cart', { onRequest: [fastify.authenticate] }, async (req) => {
        const userId = req.user.id;
        const [rows] = await fastify.db.execute(`
            SELECT sc.id, sc.quantity, sc.id_product, p.name, p.price, p.img 
            FROM shopping_cart sc
            JOIN products p ON sc.id_product = p.id
            WHERE sc.id_user = ?
        `, [userId]);
        return rows;
    });

    // ADD to Cart (Kalau sudah ada, tambah quantity)
    fastify.post('/cart', { onRequest: [fastify.authenticate] }, async (req) => {
        const userId = req.user.id;
        const { id_product, quantity } = req.body;

        // Cek apakah produk sudah ada di keranjang user ini
        const [exists] = await fastify.db.execute(
            'SELECT id, quantity FROM shopping_cart WHERE id_user = ? AND id_product = ?',
            [userId, id_product]
        );

        if (exists.length > 0) {
            // Update Quantity
            await fastify.db.execute(
                'UPDATE shopping_cart SET quantity = quantity + ? WHERE id = ?',
                [quantity, exists[0].id]
            );
        } else {
            // Insert Baru
            await fastify.db.execute(
                'INSERT INTO shopping_cart (id_user, id_product, quantity) VALUES (?, ?, ?)',
                [userId, id_product, quantity]
            );
        }

        return { message: 'Added to cart' };
    });

    // DELETE Item dari Cart
    fastify.delete('/cart/:id', { onRequest: [fastify.authenticate] }, async (req) => {
        const userId = req.user.id;
        // Pastikan hapus punya sendiri
        await fastify.db.execute(
            'DELETE FROM shopping_cart WHERE id = ? AND id_user = ?',
            [req.params.id, userId]
        );
        return { message: 'Item removed' };
    });
}
