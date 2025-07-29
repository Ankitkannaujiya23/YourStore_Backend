const cartController = {
    syncCart: async (req, res) => {
        const { userId, cart } = req.body;
        const db = req.db;
        try {
            // 1. Fetch existing cart items from DB
            const [existingItems] = await db.execute('select * from cart_items where user_id=?', [userId]);


            const existingMap = {};
            for (const item of existingItems) {
                existingMap[item.product_id] = item.quantity;
            }

            // 2. Merge guest cart into user's cart
            for (const item of cart) {
                const { productId, quantity } = item;

                if (existingMap[productId]) {
                    // If exists, update quantity
                    await db.query(
                        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                        [quantity, userId, productId]
                    );
                } else {
                    // If not exists, insert
                    await db.query(
                        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                        [userId, productId, quantity]
                    );
                }
            }

            // 3. Return updated cart
            const [finalCart] = await db.query(
                'SELECT * FROM cart_items WHERE user_id = ?',
                [userId]
            );

            return res.json({ statusCode: 200, cart: finalCart });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }

    },
    updateCart: async (req, res) => {

    },

    removeFromCart: async (req, res) => {

    }

};

export default cartController;