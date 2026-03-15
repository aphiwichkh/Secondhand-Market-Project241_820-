const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// สร้าง JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    "secretkey",
    { expiresIn: "1h" }
  );
};

// REGISTER
exports.register = async (req, res) => {

  const { username, email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    await db.query(sql, [username, email, hashedPassword]);

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json(error);
  }

};


// LOGIN
exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const sql = "SELECT * FROM users WHERE email = ?";

    const [results] = await db.query(sql, [email]);

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Wrong password"
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json(error);
  }

};

// REGISTER
exports.register = async (req, res) => {

const { name, email, password } = req.body;

try {

const hashedPassword = await bcrypt.hash(password,10);

const sql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";

db.query(sql,[name,email,hashedPassword],(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json({
message:"User registered successfully"
});

});

} catch(err){

res.status(500).json(err);

}

};