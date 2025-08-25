import { response } from "express";

const orderController = {
    createOrder: async (req, res) => {

        const userId = req.user.id;
        const { addressId, paymentMethod } = req.body;
        const db = req.db;
        try {
            const [orderDetail] = await db.execute('Call sp_createFinalOrder(?,?,?)', [userId, addressId, paymentMethod]);
            console.log({ orderDetail });

            return res.json({ statusCode: 200, message: "Order Placed Successfully!", response: orderDetail[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },
    getOrders: async (req, res) => {
        const userId = req.user.id;
        const { status } = req.body;
        const db = req.db;
        try {
            const [totalOrders] = await db.execute('Call sp_getOrders(?,?)', [userId, status]);

            return res.json({ statusCode: 200, message: 'Success', response: totalOrders[0] ?? [] });
        } catch (error) {
            return res.json({ statusCode: 500, message: error.message, response: [] });
        }
    }
};

export default orderController;