import { response } from "express";

const orderController = {
    createOrder: async (req, res) => {

        const userId = req.user.id;
        const db = req.db;
        try {
            const [orderDetail] = await db.execute('Call sp_createOrder(?)', [userId]);
            console.log({ orderDetail });

            return res.json({ statusCode: 200, message: "Order Placed Successfully!", response: orderDetail[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    }
};

export default orderController;