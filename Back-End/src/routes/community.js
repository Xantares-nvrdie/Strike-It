// src/routes/community.js
export default async function (fastify, options) {
    
    // GET Semua Postingan (Join dengan User untuk nama & avatar)
    fastify.get('/posts', async () => {
        const [rows] = await fastify.db.execute(`
            SELECT cp.*, u.name as user_name, u.avatar_img 
            FROM community_posts cp
            JOIN users u ON cp.id_user = u.id
            ORDER BY cp.created_at DESC
        `);
        return rows;
    });

    // GET Detail Postingan + Komentar
    fastify.get('/posts/:id', async (req, reply) => {
        // Ambil Post
        const [posts] = await fastify.db.execute(`
            SELECT cp.*, u.name as user_name, u.avatar_img 
            FROM community_posts cp
            JOIN users u ON cp.id_user = u.id
            WHERE cp.id = ?
        `, [req.params.id]);

        if (posts.length === 0) return reply.code(404).send({ message: 'Post not found' });

        // Ambil Komentar
        const [comments] = await fastify.db.execute(`
            SELECT pc.*, u.name as user_name, u.avatar_img 
            FROM post_comments pc
            JOIN users u ON pc.id_user = u.id
            WHERE pc.id_post = ?
            ORDER BY pc.created_at ASC
        `, [req.params.id]);

        return { post: posts[0], comments };
    });

    // CREATE Post Baru (Butuh Login)
    fastify.post('/posts', { onRequest: [fastify.authenticate] }, async (req) => {
        const { title, body, category } = req.body;
        const userId = req.user.id;

        await fastify.db.execute(
            'INSERT INTO community_posts (id_user, title, body, category) VALUES (?, ?, ?, ?)',
            [userId, title, body, category]
        );
        return { message: 'Post created successfully' };
    });

    // CREATE Komentar (Butuh Login)
    fastify.post('/posts/:id/comments', { onRequest: [fastify.authenticate] }, async (req) => {
        const { content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        await fastify.db.execute(
            'INSERT INTO post_comments (id_post, id_user, content) VALUES (?, ?, ?)',
            [postId, userId, content]
        );
        
        // Update jumlah reply di tabel post
        await fastify.db.execute('UPDATE community_posts SET reply_count = reply_count + 1 WHERE id = ?', [postId]);

        return { message: 'Comment added' };
    });

    // TOGGLE LIKE (Like/Unlike)
    fastify.post('/posts/:id/like', { onRequest: [fastify.authenticate] }, async (req) => {
        const postId = req.params.id;
        const userId = req.user.id;

        // Cek sudah like belum
        const [exists] = await fastify.db.execute(
            'SELECT id FROM post_likes WHERE id_post = ? AND id_user = ?',
            [postId, userId]
        );

        if (exists.length > 0) {
            // Kalau sudah, berarti UNLIKE
            await fastify.db.execute('DELETE FROM post_likes WHERE id_post = ? AND id_user = ?', [postId, userId]);
            await fastify.db.execute('UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = ?', [postId]);
            return { message: 'Unliked', liked: false };
        } else {
            // Kalau belum, berarti LIKE
            await fastify.db.execute('INSERT INTO post_likes (id_post, id_user) VALUES (?, ?)', [postId, userId]);
            await fastify.db.execute('UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?', [postId]);
            return { message: 'Liked', liked: true };
        }
    });
}
