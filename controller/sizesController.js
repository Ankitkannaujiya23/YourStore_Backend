const sizesController = {
    getAllSizes: async (req, res) => {
        try {
            const db = req.db;
            const [result] = await db.execute('select * from sizes');
            return res.json({ statusCode: 200, message: 'Sizes fetched successfully!!', response: result });
        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: 'Internal Server Error', response: [] });
        }
    },
    addSize: async (req, res) => {
        try {
            const db = req.db;
            const { label } = req.body;
            const result = await db.execute('Call sp_addSize(?)', [label]);
            if (result[0]?.affectedRows) {
                return res.json({ statusCode: 201, message: 'Size added successfully!!' });
            }
        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: 'Internal Server Error' });
        }
    },
    updateSize: async (req, res) => {
        try {
            const db = req.db;
            const { label } = req.body;
            const { id } = req.params;

            const result = await db.execute('Call sp_updateSize(?,?)', [id, label]);
            if (result.affectedRows) {
                return res.json({ statusCode: 200, message: 'Size updated successfully!!' });
            }

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error?.message });
        }
    },
    getSizeById: async (req, res) => {
        try {
            const db = req.db;
            const { id } = req.params;
            const [result] = await db.execute('Call sp_getSizeById(?)', [id]);
            console.log({ result });
            if (result[0]?.length > 0) {
                return res.json({ statusCode: 200, message: 'Size fetched successfully', response: result[0] });
            } else {
                return res.json({ statusCode: 404, message: 'Size not available', response: [] });
            }

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error?.message });

        }
    }
};

export default sizesController;