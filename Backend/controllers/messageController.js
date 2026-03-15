const db = require('../config/db');


// ส่งข้อความ
exports.sendMessage = async (req, res) => {

  try {

    const { sender_id, receiver_id, product_id, message } = req.body;

    const sql = `
      INSERT INTO messages
      (sender_id, receiver_id, product_id, message)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      sender_id,
      receiver_id,
      product_id,
      message
    ]);

    res.json({
      message: "Message sent",
      messageId: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// ดูข้อความของสินค้า
exports.getMessagesByProduct = async (req, res) => {

  try {

    const { id } = req.params;

    const sql = `
      SELECT 
        messages.*,
        users.username
      FROM messages
      JOIN users ON messages.sender_id = users.id
      WHERE messages.product_id = ?
      ORDER BY messages.created_at ASC
    `;

    const [rows] = await db.query(sql, [id]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// ดูข้อความทั้งหมดของ user
exports.getMessagesByUser = async (req, res) => {

  try {

    const { id } = req.params;

    const sql = `
      SELECT 
        messages.*,
        sender.username AS sender_name,
        receiver.username AS receiver_name
      FROM messages
      LEFT JOIN users AS sender 
        ON messages.sender_id = sender.id
      LEFT JOIN users AS receiver 
        ON messages.receiver_id = receiver.id
      WHERE messages.receiver_id = ?
      ORDER BY messages.created_at DESC
    `;

    const [rows] = await db.query(sql, [id]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};