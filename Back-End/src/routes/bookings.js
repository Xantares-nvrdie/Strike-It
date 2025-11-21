// routes/bookings.js
export default async function (fastify, options) {
    
    // GET Booking Saya (Harus Login)
    fastify.get('/my-bookings', { onRequest: [fastify.authenticate] }, async (req) => {
        const userId = req.user.id; // Didapat dari token JWT
        const [rows] = await fastify.db.execute(`
            SELECT b.*, l.name as location_name, l.img as location_img
            FROM bookings b
            JOIN locations l ON b.id_location = l.id
            WHERE b.id_user = ?
            ORDER BY b.created_at DESC
        `, [userId]);
        return rows;
    });

    // CREATE Booking Baru
    fastify.post('/bookings', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const userId = req.user.id;
        const { id_location, booking_date, booking_start, duration, first_name, last_name, phone } = req.body;

        // 1. Ambil data lokasi untuk cek harga
        const [locs] = await fastify.db.execute('SELECT price_per_hour FROM locations WHERE id = ?', [id_location]);
        
        if (locs.length === 0) return reply.code(404).send({ message: 'Lokasi tidak ditemukan' });
        
        const pricePerHour = locs[0].price_per_hour;
        
        // 2. Hitung Total Harga
        const totalPrice = pricePerHour * duration;
        const invoiceNumber = `INV-${Date.now()}`; // Simple invoice generator

        // 3. Simpan ke Database
        // Status default 'pending', payment_status 'unpaid'
        await fastify.db.execute(`
            INSERT INTO bookings 
            (id_user, id_location, first_name, last_name, phone, booking_date, booking_start, duration, total_price, invoice_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [userId, id_location, first_name, last_name, phone, booking_date, booking_start, duration, totalPrice, invoiceNumber]);

        return { message: 'Booking berhasil dibuat', invoice: invoiceNumber, total: totalPrice };
    });
}
