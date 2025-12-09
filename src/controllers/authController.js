const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/db");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.json({ error: "Email đã tồn tại" });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash });

  res.json({ message: "Đăng ký thành công" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Sai email hoặc mật khẩu" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ error: "Sai mật khẩu" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({ message: "Đăng nhập thành công", token });
};
