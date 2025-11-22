// src/routes/reviews.js
export default async function (fastify, options) {

    fastify.get('/location-public', async (request, reply) => {
        try {
            // Query: Ambil review, nama user, avatar, DAN nama lokasi
            const [rows] = await fastify.db.query(`
                SELECT 
                    lr.id, 
                    lr.comment, 
                    lr.rating, 
                    u.name as user_name, 
                    u.avatar_img,
                    l.name as location_name
                FROM location_reviews lr
                JOIN users u ON lr.id_user = u.id
                JOIN locations l ON lr.id_location = l.id
                ORDER BY lr.created_at DESC
                LIMIT 15
            `);
            return rows;
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Gagal mengambil data review lokasi' });
        }
    });
}
