const db = require('../config/db');

// CREATE PRODUCT
exports.createProduct = async (req, res) => {

  try {

    const { title, description, price, category_id, user_id } = req.body;

    const sql = `
      INSERT INTO products 
      (title, description, price, category_id, user_id) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title,
      description,
      price,
      category_id,
      user_id
    ]);

    res.json({
      message: "Product created",
      productId: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {

  try {

    const sql = `
      SELECT 
        products.*,
        users.username,
        categories.name AS category_name
      FROM products
      LEFT JOIN users ON products.user_id = users.id
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.created_at DESC
    `;

    const [rows] = await db.query(sql);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {

  try {

    const { id } = req.params;

    const sql = `
      SELECT 
        products.*,
        users.username,
        categories.name AS category_name
      FROM products
      LEFT JOIN users ON products.user_id = users.id
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        products.*,
        users.username,
        categories.name AS category_name
      FROM products
      JOIN users ON products.user_id = users.id
      JOIN categories ON products.category_id = categories.id
      WHERE categories.id = ?
      `,
      [id]
    );

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;

    const sql = `
      DELETE FROM products
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    res.json({
      message: "Product deleted"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

// SEARCH PRODUCTS
exports.searchProducts = async (req, res) => {

  try {

    const { q } = req.query;

    const sql = `
      SELECT 
        products.*,
        users.username,
        categories.name AS category_name
      FROM products
      LEFT JOIN users ON products.user_id = users.id
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.title LIKE ? OR products.description LIKE ?
    `;

    const search = `%${q}%`;

    const [rows] = await db.query(sql, [search, search]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

// GET PRODUCTS BY USER
exports.getProductsByUser = async (req, res) => {

  try {

    const { id } = req.params;

    const sql = `
      SELECT *
      FROM products
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [id]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {

  try {

    const { id } = req.params;
    const { title, description, price, category_id } = req.body;

    const sql = `
      UPDATE products
      SET title = ?, description = ?, price = ?, category_id = ?
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      title,
      description,
      price,
      category_id,
      id
    ]);

    res.json({
      message: "Product updated"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};