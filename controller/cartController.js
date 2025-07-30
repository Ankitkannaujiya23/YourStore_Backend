import { response } from "express";

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

            return res.json({ statusCode: 200, message: "Cart Synced Successfully", response: finalCart });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }

    },
    addToCart: async (req, res) => {
        const { productId, quantity, userId } = req.body;
        const db = req.db;
        try {
            const result = await db.execute("CALL sp_addToCart(?, ?, ?)", [userId, productId, quantity]);
            return res.json({ statusCode: 200, message: "Item added to cart successfully." });
        } catch (err) {
            console.error("Add to cart error:", err);
            return res.json({ statusCode: 500, message: err.message });
        }
    },
    updateCart: async (req, res) => {
        const { userId, productId, quantity } = req.body;
        const db = req.db;
        try {
            const [updatedCart] = db.execute("Call sp_updateCart(?,?,?)", [userId, productId, quantity]);
            return res.json({ statusCode: 200, message: "Cart Updated Successfully", response: updatedCart[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },

    removeFromCart: async (req, res) => {
        const { userId, productId } = req.body;
        const db = req.db;
        try {
            const [updatedCart] = await db.execute('Call sp_removeCartItem(?,?)', [userId, productId]);
            return res.json({ statusCode: 200, message: "Cart item removed successfully", response: updatedCart[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    }

};

export default cartController;