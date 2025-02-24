const productController = {
  getAllProducts: async (req, res) => {
    try {
      const db = req.db;
      const [products] = await db.execute("CALL sp_getProducts()");
      return res.json({
        statusCode: 200,
        message: "Products successfully fetched.",
        data: products[0],
      });
    } catch (error) {
      return res.json({ statusCode: 500, message: error.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      const db = req.db;

      const [product] = await db.execute("CALL sp_getProductById(?)", [id]);

      return res.json({
        statusCode: 200,
        message: "Product successfully fetched.",
        data: product[0],
      });
    } catch (error) {
      return res.json({ statusCode: 500, message: error.message });
    }
  },
  addProduct: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.json({
        statusCode: 403,
        message: "Access Denied. Admins only.",
      });
    }
    const { name, description, price, stock, category, image } = req.body;
    try {
      const db = req.db;
      await db.execute("CALL sp_addProduct(?,?,?,?,?,?)", [
        name,
        description,
        price,
        category,
        image,
        stock,
      ]);

      return res.json({
        statusCode: 201,
        message: "Product added successfully.",
      });
    } catch (error) {
      return res.json({ statusCode: 500, message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.json({
        statusCode: 403,
        message: "Access Denied. Admins access only.",
      });
    }
    const { id, name, description, price, category, stock, image } = req.body;
    try {
      const db = req.db;
      await db.execute("CALL sp_updateProduct(?,?,?,?,?,?,?)", [
        id,
        name,
        description,
        price,
        category,
        image,
        stock,
      ]);

      return res.json({
        statusCode: 200,
        message: "Product updated successfully.",
      });
    } catch (error) {
      return res.json({ statusCode: 500, message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.json({
        statusCode: 403,
        message: "Access Denied. Admin access only",
      });
    }
    try {
      const db = req.db;
      await db.execute("CALL sp_deleteProduct(?)", [req.params.id]);
      return res.json({
        statusCode: 200,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      return res.json({ statusCode: 500, message: error.message });
    }
  },
};

export default productController;
