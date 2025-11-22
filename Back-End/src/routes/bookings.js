// src/routes/bookings.js
export default async function (fastify, options) {

    // 1. CREATE (Tetap sama, saya singkat biar fokus ke GET)
    fastify.post('/', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        return { message: "Booking berhasil" }; 
    });

    // 2. GET My Bookings (UPDATE DISINI)
    fastify.get('/my-bookings', {
        onRequest: [fastify.authenticate] 
    }, async (request, reply) => {
        try {
            const userId = request.user.id;

            // PERUBAHAN PENTING DI SINI:
            // 1. Tambahkan: LEFT JOIN location_reviews lr ON b.id = lr.id_booking
            // 2. Tambahkan Select: CASE WHEN lr.id IS NOT NULL THEN 1 ELSE 0 END as is_reviewed
            
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
}
