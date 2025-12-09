const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/db");

module.exports = (req, res, next) => {
  // Hỗ trợ lấy token từ nhiều nguồn: Authorization header (Bearer), x-access-token, query hoặc body
  let token = null;

  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization;
  } else if (req.headers && req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }

  if (!token) return res.status(401).json({ error: "Không có token" });

  // Nếu dạng 'Bearer <token>' thì cắt phần 'Bearer '
  if (typeof token === "string" && token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};
