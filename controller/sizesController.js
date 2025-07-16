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
            const { name } = req.body;
            const result = await db.execute('Call sp_addSize(?)', [name]);
            if (result[0]?.affectedRows) {
                return res.json({ statusCode: 201, message: 'Size added successfully!!' });
            }
        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: 'Internal Server Error' });
        }
    }
};

export default sizesController;