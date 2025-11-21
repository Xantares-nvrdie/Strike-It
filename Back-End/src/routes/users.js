import bcrypt from 'bcrypt';

export default async function (fastify, options) {

    // --- 1. GET ALL USERS ---
    fastify.get('/users', async (req, reply) => {
        const [rows] = await fastify.db.execute(
            'SELECT id, name, email, bio, avatar_img FROM users'
        );
        return rows;
    });

    // --- 2. GET MY PROFILE (PENTING: Taruh paling atas sebelum /:id) ---
    // Ini untuk mengambil data saat halaman Profil dibuka
    fastify.get('/users/me', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const userId = req.user.id;
        const [rows] = await fastify.db.execute(`
            SELECT u.id, u.name, u.email, u.bio, u.avatar_img, u.date_birth, 
                   m.name as membership_name, m.description as membership_desc
            FROM users u
            LEFT JOIN memberships m ON u.id_membership = m.id
            WHERE u.id = ?
        `, [userId]);
        
        if (rows.length === 0) return reply.code(404).send({ error: 'User not found' });
        return rows[0];
    });

    // --- 3. UPDATE PROFILE (PUT) - PENTING: INI YANG HILANG ---
    // Ini rute yang dipanggil saat tombol "Simpan" diklik
    fastify.put('/users/me', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const userId = req.user.id;
        const { name, bio, date_birth, avatar_img } = req.body;
        const validDate = date_birth === '' ? null : date_birth;
        try {
            await fastify.db.execute(`
                UPDATE users 
                SET name = ?, bio = ?, date_birth = ?, avatar_img = ?
                WHERE id = ?
            `, [name, bio, date_birth, avatar_img, userId]);

            return { message: 'Profil berhasil diperbarui' };
        } catch (err) {
            fastify.log.error(err); // Log error ke terminal biar ketahuan
            return reply.code(500).send({ error: err.message });
        }
    });

    // --- 4. GET USER BY ID (Taruh di BAWAH /users/me) ---
    fastify.get('/users/:id', async (req, reply) => {
        const [rows] = await fastify.db.execute(
            'SELECT id, name, email, bio, avatar_img FROM users WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return reply.code(404).send({ error: 'User not found' });
        }
        return rows[0];
    });

    // --- 5. REGISTER USER (POST) ---
    fastify.post('/users', async (req, reply) => {
        const { name, email, password } = req.body;

        // Cek email
        const [existing] = await fastify.db.execute(
            'SELECT id FROM users WHERE email = ?', [email]
        );
        if (existing.length > 0) {
            return reply.code(400).send({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultMembershipId = 2; // Default ke 'Kawan Mancing' (ID 2)

        try {
            await fastify.db.execute(
                'INSERT INTO users (name, email, password, id_membership) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, defaultMembershipId]
            );
            return reply.code(201).send({ message: 'User created successfully' });
        } catch (err) {
            return reply.code(500).send({ error: err.message });
        }
    });

    // --- 6. LOGIN USER (POST) ---
    fastify.post('/login', async (req, reply) => {
        const { email, password } = req.body;

        const [users] = await fastify.db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (users.length === 0) {
            return reply.code(401).send({ message: 'Email atau password salah' });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return reply.code(401).send({ message: 'Email atau password salah' });
        }

        const token = fastify.jwt.sign({ 
            id: user.id, 
            email: user.email, 
            name: user.name 
        });

        return { 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        };
    });
}
