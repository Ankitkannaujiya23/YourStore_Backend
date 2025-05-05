const categoryController = {
    getCategories: async (req, res) => {
        try {

            const db = req.db;
            const [categories] = await db.execute('Call sp_getCategories()');
            return res.json({ statusCode: 200, message: 'Category fetched successfully!', response: categories[0] })

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error?.message })
        }
    },

    addCategory: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.json({ statusCode: 403, message: 'Access Denied!, Admins only' })
            }

            const { name } = req.body;
            const db = req.db;
            const [result] = await db.execute('Call sp_addCategory(?)', [name]);
            if (result && result[0][0].categoryId) {
                return res.json({
                    statusCode: 200,
                    message: 'Category created successfully',
                    data: { id: result[0][0].categoryId, name }
                });
            }
        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message })
        }
    },
    getCategoryById: async (req, res) => {

        try {
            const id = req.params.id;
            const db = req.db;
            const [result] = await db.execute('Call sp_getCategoryById(?)', [id]);
            return res.json({ statusCode: 200, message: "Category Fetched", data: result[0] });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const db = req.db;
            const categoryId = req.params.id;
            const name = req.body;
            if (req.user.role !== 'admin') {
                return res.json({ statusCode: 403, message: "Access Denied!!" })
            }
            const [isExist] = await db.execute('select * from categories where id=?', [categoryId]);
            if (isExist.length === 0) {
                return res.json({ statusCode: 404, message: "Category not found!" });
            }
            const [result] = await db.execute('Call sp_updateCategory(?,?)', [categoryId, name]);

            const updatedData = result[0][0];
            return res.json({ statusCode: 200, message: "Category Updated Successfully!", data: updatedData });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },


}
export default categoryController;