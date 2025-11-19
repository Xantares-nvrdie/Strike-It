export default async function (fastify, options) {
    fastify.get('/products', async () => {
        const [rows] = await fastify.db.execute(`
            SELECT p.*, c.name AS category
            FROM products p
            LEFT JOIN category_products c ON p.id_category = c.id
        `);
        return rows;
    });

    fastify.get('/products/:id', async (req) => {
        const [rows] = await fastify.db.execute(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );
        return rows[0];
    });

    fastify.post('/products', async (req) => {
        const { name, description, img, price, specification, method, id_category } = req.body;
        await fastify.db.execute(
            `INSERT INTO products 
            (name, description, img, price, specification, method, id_category) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, description, img, price, specification, method, id_category]
        );
        return { message: 'Product created' };
    });
}
