const db = require("../config/db");

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name FROM categories ORDER BY id ASC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};