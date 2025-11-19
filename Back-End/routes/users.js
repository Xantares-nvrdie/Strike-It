export default async function (fastify, options) {
    fastify.get('/users', async () => {
        const [rows] = await fastify.db.execute(
        'SELECT id, name, email, bio, avatar_img FROM users'
        );
        return rows;
    });

    fastify.get('/users/:id', async (req) => {
        const [rows] = await fastify.db.execute(
        'SELECT id, name, email, bio, avatar_img FROM users WHERE id = ?',
        [req.params.id]
        );
        return rows[0];
    });

    fastify.post('/users', async (req) => {
        const { name, email, password } = req.body;
        await fastify.db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
        );
        return { message: 'User created' };
    });
}
