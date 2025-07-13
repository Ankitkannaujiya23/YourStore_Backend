import { response } from "express";

const colorsController = {
    getColors: async (req, res) => {
        try {
            const db = req.db;
            const [colors] = await db.execute('select * from colors');
            console.log({ colors });
            return res.json({ statusCode: 200, message: 'Colors fetched successfully', response: colors });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },
    getColorById: async (req, res) => {
        try {
            const db = req.db;
            const id = req.params.id;
            const [color] = await db.execute('Call sp_getColorById(?)', [id]);
            console.log({ color });
        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },

    addColor: async (req, res) => {
        try {
            const db = req.db;
            const { name, hexCode } = req.body;
            const [result] = await db.execute('Call sp_addColor(?,?)', [name, hexCode]);
            console.log({ result });
            if (result.affectedRows) {
                return res.json({ statusCode: 200, message: 'Color Addedd Successfully' });
            };

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    },
    updateColor: async (req, res) => {
        try {
            const db = req.db;
            const { id } = req.params;
            const { name, hexCode } = req.body;

            const [result] = await db.execute('Call sp_updateColor(?,?,?)', [id, name, hexCode]);

            console.log({ result });

        } catch (error) {
            console.log({ error });
            return res.json({ statusCode: 500, message: error.message });
        }
    }
};

export default colorsController;