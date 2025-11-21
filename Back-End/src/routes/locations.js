export default async function (fastify, options) {
    fastify.get('/locations', async () => {
        const [rows] = await fastify.db.execute('SELECT * FROM locations');
        return rows;
    });

    fastify.get('/locations/:id', async (req) => {
        const [rows] = await fastify.db.execute(
        'SELECT * FROM locations WHERE id = ?',
        [req.params.id]
        );
        return rows[0];
    });

    fastify.post('/locations', async (req) => {
        const { name, city, description, address, price_per_hour, img } = req.body;
        await fastify.db.execute(
        `INSERT INTO locations (name, city, description, address, price_per_hour, img) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, city, description, address, price_per_hour, img]
        );
        return { message: 'Location created' };
    });
}
