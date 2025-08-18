import { validationResult } from "express-validator";

const addressController = {
    addAddress: async (req, res) => {
        try {
            const db = req.db;
            const userId = req.user.id;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({ statusCode: 400, message: "Bad Request", errors: errors.array() })
            }
            const {
                fullname, mobileno, address_line1, address_line2,
                city, state, pincode, country, is_default
            } = req.body;



            const [rows] = await db.execute(
                'CALL sp_addAddress(?,?,?,?,?,?,?,?,?,?)',
                [userId, fullname, mobileno, address_line1, address_line2, city, state, pincode, country || 'India', is_default ? 1 : 0]
            );
            // rows[0] contains SELECT result
            return res.json({ statusCode: 200, message: "Address added successfully", response: rows[0][0] });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ statusCode: 500, message: err.message });
        }
    },
    updateAddress: async (req, res) => {
        const db = req.db;
        const userId = req.user.id;
        const addressId = req.body.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({ statusCode: 400, message: "Bad Request", errors: errors.array() })
        }
        const { fullname, mobileno, email, address_line1, address_line2, city, state, pincode, country, is_default } = req.body;

        try {
            const [rows] = await db.execute(
                'CALL sp_updateAddress(?,?,?,?,?,?,?,?,?,?,?,?)',
                [addressId, userId, fullname, mobileno, email, address_line1, address_line2, city, state, pincode, country || 'India', is_default ? 1 : 0]
            );
            return res.json({ statusCode: 200, message: "Address Updated Succesfully!!", response: rows[0][0] });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ statusCode: 500, message: err.message });
        }
    },
    deleteAddress: async (req, res) => {
        const db = req.db;
        const userId = req.user.id;
        const addressId = req.params.id;

        try {
            const [rows] = await db.execute('CALL sp_deleteAddress(?, ?)', [addressId, userId]);
            const deleted = rows[0][0].deleted;
            return res.json({ statusCode: 200, message: "Address Deleted Successfully", response: deleted });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ statusCode: 500, message: err.message });
        }
    },
    getAddress: async (req, res) => {
        const db = req.db;
        const userId = req.user.id;
        try {
            const [rows] = await db.execute('CALL sp_getAddresses(?)', [userId]);
            return res.json({ statusCode: 200, message: "Address Fetched Successfully", response: rows[0] });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ statusCode: 500, message: err.message });
        }
    }
};

export default addressController;