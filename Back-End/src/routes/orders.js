// routes/orders.js
export default async function (fastify, options) {

    // CREATE Order (Checkout)
    fastify.post('/orders', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const userId = req.user.id;
        const { items, shipping_address, shipping_cost = 0 } = req.body; 
        // items adalah array: [{ id_product: 1, quantity: 2 }, ...]

        if (!items || items.length === 0) {
            return reply.code(400).send({ message: 'Keranjang kosong' });
        }

        const connection = await fastify.db.getConnection(); // Ambil koneksi manual untuk transaction

        try {
            await connection.beginTransaction(); // Mulai Transaksi

            // 1. Hitung Total Belanja (Validasi harga dari Server, bukan dari Frontend!)
            let totalAmount = 0;
            const orderItemsData = [];

            for (const item of items) {
                const [products] = await connection.execute(
                    'SELECT price, stock FROM products WHERE id = ?', [item.id_product]
                );
                
                if (products.length === 0) throw new Error(`Produk ID ${item.id_product} tidak ditemukan`);
                
                const product = products[0];
                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;

                // Siapkan data untuk dimasukkan ke order_items nanti
                orderItemsData.push({
                    id_product: item.id_product,
                    quantity: item.quantity,
                    unit_price: product.price,
                    subtotal: subtotal
                });
            }

            totalAmount += shipping_cost;
            const orderNumber = `ORD-${Date.now()}`;

            // 2. Insert ke tabel ORDERS
            const [orderResult] = await connection.execute(`
                INSERT INTO orders (id_user, order_number, total_amount, shipping_address, shipping_cost)
                VALUES (?, ?, ?, ?, ?)
            `, [userId, orderNumber, totalAmount, shipping_address, shipping_cost]);

            const orderId = orderResult.insertId;

            // 3. Insert ke tabel ORDER_ITEMS (Looping)
            for (const data of orderItemsData) {
                await connection.execute(`
                    INSERT INTO order_items (id_order, id_product, quantity, unit_price, subtotal)
                    VALUES (?, ?, ?, ?, ?)
                `, [orderId, data.id_product, data.quantity, data.unit_price, data.subtotal]);
                
                // Optional: Kurangi Stock Produk di sini jika mau
            }

            await connection.commit(); // Simpan permanen jika semua lancar
            return { message: 'Order berhasil', order_number: orderNumber };

        } catch (err) {
            await connection.rollback(); // Batalkan semua jika ada error
            fastify.log.error(err);
            return reply.code(500).send({ message: 'Gagal membuat order', error: err.message });
        } finally {
            connection.release(); // Lepas koneksi
        }
    });

    // GET My Orders
    fastify.get('/my-orders', { onRequest: [fastify.authenticate] }, async (req) => {
        const userId = req.user.id;
        const [rows] = await fastify.db.execute(
            'SELECT * FROM orders WHERE id_user = ? ORDER BY created_at DESC', 
            [userId]
        );
        return rows;
    });
}
