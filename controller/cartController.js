import { response } from "express";

const cartController = {
    syncCart: async (req, res) => {
        const { cart } = req.body;
        const userId = req.user.id;
        console.log({ userId, cart });
        const db = req.db;
        try {
            const [finalCart] = await db.execute('CALL sp_syncCart(?,?)', [userId, JSON.stringify(cart)]);
            const productList = finalCart[0]?.map((item) => { return { ...item, image: JSON.parse(item.image) } })
            return res.json({ statusCode: 200, message: "Cart Synced Successfully", response: productList });

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
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const db = req.db;
        try {
            const [updatedCart] = await db.execute("Call sp_updateCart(?,?,?)", [userId, productId, quantity]);
            return res.json({ statusCode: 200, message: "Cart Updated Successfully", response: updatedCart[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },
    removeFromCart: async (req, res) => {
        const { productId } = req.body;
        const userId = req.user.id;
        const db = req.db;
        try {
            const [updatedCart] = await db.execute('Call sp_removeCartItem(?,?)', [userId, productId]);
            return res.json({ statusCode: 200, message: "Cart item removed successfully", response: updatedCart[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },
    fetchCart: async (req, res) => {
        const userId = req.user.id;
        const db = req.db;
        try {
            const [cartItems] = await db.execute('Call sp_fetchCart(?)', [userId]);
            const productList = cartItems[0]?.map((item) => { return { ...item, image: JSON.parse(item.image) } })
            return res.json({ statusCode: 200, message: "Cart fetched successfully", response: productList });
        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    }

};

export default cartController;