export default async function (fastify, options) {

    // POST /orders (Checkout dari Cart)
    fastify.post('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        const connection = await fastify.db.getConnection();
        try {
            const userId = request.user.id;
            const { 
                shipping_address, payment_method, notes, 
                shipping_cost = 0, tax_amount = 0, discount_amount = 0 
            } = request.body;

            await connection.beginTransaction();

            // 1. Ambil semua item di keranjang user
            // Join dengan produk untuk dapat harga terupdate
            const [cartItems] = await connection.query(`
                SELECT sc.*, p.price_sale, p.price_rent 
                FROM shopping_cart sc
                JOIN products p ON sc.id_product = p.id
                WHERE sc.id_user = ?
            `, [userId]);

            if (cartItems.length === 0) {
                throw new Error('Keranjang kosong');
            }

            // 2. Hitung Total
            let totalAmount = 0;
            const orderItemsData = [];

            for (const item of cartItems) {
                // Tentukan harga berdasarkan tipe transaksi (sewa/beli)
                const price = item.transaction_type === 'sewa' ? item.price_rent : item.price_sale;
                const subtotal = price * item.quantity;
                totalAmount += subtotal;

                orderItemsData.push({
                    id_product: item.id_product,
                    quantity: item.quantity,
                    unit_price: price,
                    subtotal: subtotal,
                    transaction_type: item.transaction_type // Simpan tipe di order_items juga (perlu update tabel jika belum ada)
                });
            }

            // 3. Buat Order Utama
            const orderNumber = `ORD-${Date.now()}`;
            const [orderResult] = await connection.query(`
                INSERT INTO orders 
                (id_user, order_number, total_amount, shipping_cost, shipping_address, status, payment_status, created_at, tax_amount, discount_amount, notes)
                VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid', NOW(), ?, ?, ?)
            `, [userId, orderNumber, totalAmount, shipping_cost, shipping_address, tax_amount, discount_amount, notes]);

            const orderId = orderResult.insertId;

            // 4. Pindahkan Item Keranjang ke Order Items
            for (const item of orderItemsData) {
                await connection.query(`
                    INSERT INTO order_items (id_order, id_product, quantity, unit_price, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                `, [orderId, item.id_product, item.quantity, item.unit_price, item.subtotal]);
            }

            // 5. Kosongkan Keranjang
            await connection.query('DELETE FROM shopping_cart WHERE id_user = ?', [userId]);

            await connection.commit();
            connection.release();

            return { message: 'Pesanan berhasil dibuat', order_number: orderNumber };

        } catch (error) {
            await connection.rollback();
            connection.release();
            request.log.error(error);
            return reply.code(500).send({ message: error.message || 'Gagal membuat pesanan' });
        }
    });
}
