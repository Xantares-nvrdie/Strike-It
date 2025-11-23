export default async function (fastify, options) {

    // 1. GET ALL PRODUCTS
    fastify.get('/', async (request, reply) => {
        try {
            const { category, search, minPrice, maxPrice } = request.query;
            
            let query = 'SELECT * FROM products WHERE 1=1';
            const params = [];

            if (category) {
                query = `
                    SELECT p.* FROM products p 
                    JOIN category_products c ON p.id_category = c.id 
                    WHERE c.name LIKE ? OR p.name LIKE ?
                `;
                params.push(`%${category}%`, `%${category}%`);
            } else {
                if (search) { query += ' AND name LIKE ?'; params.push(`%${search}%`); }
                if (minPrice) { query += ' AND price_sale >= ?'; params.push(minPrice); }
                if (maxPrice) { query += ' AND price_sale <= ?'; params.push(maxPrice); }
            }

            const [rows] = await fastify.db.query(query, params);
            return rows;
        } catch (error) {
            return reply.code(500).send({ message: 'Gagal ambil data' });
        }
    });

    // 2. GET PRODUCT DETAIL (DENGAN GAMBAR)
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            
            // A. Ambil Produk
            const [prods] = await fastify.db.query('SELECT * FROM products WHERE id = ?', [id]);
            if (prods.length === 0) return reply.code(404).send({ message: 'Produk tidak ditemukan' });
            const product = prods[0];

            // B. Ambil Gambar (INI YANG KURANG TADI)
            const [images] = await fastify.db.query(
                'SELECT img_path, img_type FROM product_images WHERE id_product = ?', 
                [id]
            );
            
            // C. Masukkan ke respon
            product.images = images; 

            return product;
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ message: 'Error server' });
        }
    });

    // 3. GET REVIEWS
    fastify.get('/:id/reviews', async (request, reply) => {
        try {
            const { id } = request.params;
            const [rows] = await fastify.db.query(`
                SELECT pr.*, u.name as username 
                FROM product_reviews pr
                JOIN users u ON pr.id_user = u.id
                WHERE pr.id_product = ? ORDER BY pr.created_at DESC
            `, [id]);
            return rows;
        } catch (error) {
            return reply.code(500).send({ message: 'Gagal ambil review' });
        }
    });
}
