const db = require("../config/db");

exports.sendMessage = async (req, res) => {
  const { receiver_id, product_id, message } = req.body;

  if (!receiver_id || !product_id || !message) {
    return res.status(400).json({
      message: "receiver_id, product_id, and message are required",
    });
  }

  try {
    const [result] = await db.query(
      `
        INSERT INTO messages (sender_id, receiver_id, product_id, message)
        VALUES (?, ?, ?, ?)
      `,
      [req.user.id, receiver_id, product_id, message]
    );

    return res.status(201).json({
      message: "Message sent",
      messageId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMessagesByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          messages.*,
          users.username AS sender_name
        FROM messages
        JOIN users ON messages.sender_id = users.id
        WHERE messages.product_id = ?
        ORDER BY messages.created_at ASC, messages.id ASC
      `,
      [id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMessagesByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "You can only view your own inbox",
      });
    }

    const [rows] = await db.query(
      `
        SELECT
          messages.*,
          sender.username AS sender_name,
          receiver.username AS receiver_name,
          products.title AS product_title
        FROM messages
        LEFT JOIN users AS sender ON messages.sender_id = sender.id
        LEFT JOIN users AS receiver ON messages.receiver_id = receiver.id
        LEFT JOIN products ON messages.product_id = products.id
        WHERE messages.receiver_id = ?
        ORDER BY messages.created_at DESC, messages.id DESC
      `,
      [id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
