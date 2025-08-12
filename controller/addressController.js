const addressController = {
    addAddress: async (req, res) => {
        const db = req.db;
        const userId = req.user.id;
        const {
            fullname, phone, address_line1, address_line2,
            city, state, postal_code, country, is_default
        } = req.body;

        try {
            const [rows] = await db.execute(
                'CALL sp_addAddress(?,?,?,?,?,?,?,?,?,?)',
                [userId, fullname, phone, address_line1, address_line2, city, state, postal_code, country || 'India', is_default ? 1 : 0]
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
        const addressId = req.params.id;
        const { fullname, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = req.body;

        try {
            const [rows] = await db.execute(
                'CALL sp_updateAddress(?,?,?,?,?,?,?,?,?,?,?)',
                [addressId, userId, fullname, phone, address_line1, address_line2, city, state, postal_code, country || 'India', is_default ? 1 : 0]
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