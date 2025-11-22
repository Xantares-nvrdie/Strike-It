// src/routes/bookings.js
export default async function (fastify, options) {

    // 1. GET Booking Saya (Riwayat Pesanan)
    // URL: GET /bookings/my-bookings
    fastify.get('/my-bookings', {
        onRequest: [fastify.authenticate] 
    }, async (request, reply) => {
        try {
            const userId = request.user.id;

            // Query lengkap dengan JOIN ke locations dan cek status review
            const [rows] = await fastify.db.query(`
                SELECT 
                    b.id,
                    b.id_location,
                    b.booking_start,
                    b.booking_end,
                    b.total_price,
                    b.status,
                    b.payment_status,
                    b.spot_number,
                    l.name as location_name,
                    l.city,
                    l.img as location_img,
                    CASE WHEN lr.id IS NOT NULL THEN 1 ELSE 0 END as is_reviewed
                FROM bookings b
                JOIN locations l ON b.id_location = l.id
                LEFT JOIN location_reviews lr ON b.id = lr.id_booking
                WHERE b.id_user = ?
                ORDER BY b.booking_start DESC
            `, [userId]);

            return rows;
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Gagal mengambil riwayat pesanan' });
        }
    });

    // 2. CREATE Booking Baru
    // URL: POST /bookings/
    fastify.post('/', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const userId = req.user.id;
        
        // Ambil data dari body request
        const { id_location, booking_date, booking_start, duration, total_price, spot_number, first_name, last_name, phone } = req.body;

        const invoiceNumber = `INV-${Date.now()}`;
        
        // Hitung waktu selesai (booking_end)
        const startObj = new Date(booking_start);
        const endObj = new Date(startObj.getTime() + duration * 60 * 60 * 1000);
        const booking_end = endObj.toISOString().slice(0, 19).replace('T', ' ');

        try {
            // Simpan ke Database
            await fastify.db.execute(`
                INSERT INTO bookings 
                (id_user, id_location, spot_number, first_name, last_name, phone, booking_date, booking_start, booking_end, duration, total_price, invoice_number, status, payment_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid')
            `, [userId, id_location, spot_number, first_name, last_name, phone, booking_date, booking_start, booking_end, duration, total_price, invoiceNumber]);

            return { message: 'Booking berhasil dibuat', invoice: invoiceNumber };
        } catch (err) {
            req.log.error(err);
            return reply.code(500).send({ message: 'Gagal membuat booking di database' });
        }
    });
}
