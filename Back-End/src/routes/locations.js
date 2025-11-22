// src/routes/locations.js
export default async function (fastify, options) {

    // 1. GET ALL LOCATIONS (List)
    // URL: GET /locations
    fastify.get('/', async (request, reply) => {
        try {
            const [rows] = await fastify.db.query('SELECT * FROM locations ORDER BY id ASC');
            
            if (rows.length === 0) {
                 return []; 
            }
            return rows;
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Gagal mengambil data lokasi' });
        }
    });

    // 2. GET LOCATION DETAIL
    // URL: GET /locations/:id
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            
            // A. Ambil Data Utama Lokasi
            const [locs] = await fastify.db.query('SELECT * FROM locations WHERE id = ?', [id]);
            if (locs.length === 0) return reply.code(404).send({ message: 'Lokasi tidak ditemukan' });
            const location = locs[0];

            // B. Ambil Semua Gambar Terkait (Main & Gallery)
            const [images] = await fastify.db.query('SELECT img_path, img_type FROM location_images WHERE id_location = ?', [id]);
            
            // C. Gabungkan ke object location
            location.images = images; 

            return location;
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Error server' });
        }
    });

    // 3. GET REVIEWS BY LOCATION
    // URL: GET /locations/:id/reviews
    fastify.get('/:id/reviews', async (request, reply) => {
        try {
            const { id } = request.params;
            const [rows] = await fastify.db.query(`
                SELECT 
                    lr.id, lr.rating, lr.comment, lr.created_at,
                    u.name as username, u.avatar_img as avatarUrl
                FROM location_reviews lr
                JOIN users u ON lr.id_user = u.id
                WHERE lr.id_location = ?
                ORDER BY lr.created_at DESC
            `, [id]);
            return rows;
        } catch (error) {
            return reply.code(500).send({ message: 'Gagal mengambil review' });
        }
    });

    // 4. GET SEAT AVAILABILITY (Cek Kursi)
    // URL: GET /locations/:id/spots?date=YYYY-MM-DD
    fastify.get('/:id/spots', async (request, reply) => {
        try {
            const { id } = request.params;
            const { date } = request.query; 

            if (!date) return reply.code(400).send({ message: 'Tanggal booking wajib diisi' });

            // A. Ambil Master Spot (T1, T2, dst)
            const [allSpots] = await fastify.db.query(
                'SELECT spot_name FROM location_spots WHERE id_location = ?', 
                [id]
            );

            // B. Ambil Spot yang SUDAH DIBOOKING pada tanggal tersebut
            const [bookedSpots] = await fastify.db.query(`
                SELECT spot_number 
                FROM bookings 
                WHERE id_location = ? 
                AND booking_date = ? 
                AND status != 'cancelled'
            `, [id, date]);

            // C. Mapping Status (Occupied vs Available)
            const occupiedSet = new Set(bookedSpots.map(b => b.spot_number));

            const results = allSpots.map(s => ({
                id: s.spot_name,
                name: s.spot_name,
                status: occupiedSet.has(s.spot_name) ? 'occupied' : 'available'
            }));

            return results;

        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Gagal memuat data kursi' });
        }
    });
}
