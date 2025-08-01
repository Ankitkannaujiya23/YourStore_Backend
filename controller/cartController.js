import { response } from "express";

const cartController = {
    syncCart: async (req, res) => {
        const { cart } = req.body;
        const userId = req.user.id;
        console.log({ userId, cart });
        const db = req.db;
        try {
            // 1. Fetch existing cart items from DB
            const [existingCart] = await db.execute('select * from cart_items where user_id=?', [userId]);
            for (const guestItem of cart) {
                const isCartExist = existingCart.find(item => item.product_id === guestItem.id);
                if (isCartExist) {
                    await db.execute('update cart_items set quantity = quantity + ? where user_id = ? and product_id=?', [guestItem.quantity, userId, guestItem.id]);
                } else {
                    await db.execute('insert into cart_items (user_id,product_id,quantity)values(?,?,?)', [userId, guestItem.id, guestItem.quantity]);
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