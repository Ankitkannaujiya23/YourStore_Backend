const productController = {
  getAllProducts: async (req, res) => {
    try {
      const db = req.db;
      const [products] = await db.execute("CALL sp_getProducts()");
      const productList= products[0].map(item=> {return {...item, image:JSON.parse(item.image)}});

      return res.json({
        statusCode: 200,
        message: "Products successfully fetched.",
        data: productList,
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
    const { name, description, price, stock, category } = req.body;
    //const image= req.files.map(img=> img.filename);
    const image= req.files.map(file=> `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)

    try {
      const db = req.db;
     const product= await db.execute("CALL sp_addProduct(?,?,?,?,?,?)", [
        name,
        description,
        price,
        category,
        JSON.stringify(image),
        stock,
      ]);
      console.log({product});
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
