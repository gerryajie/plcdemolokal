const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  const allowedRoles = ["admin", "operator"];

  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Role tidak valid. Gunakan 'admin' atau 'operator'.",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hash,
    role: role || "operator",
  });

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
};


exports.login = async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {

      return res.status(404).json({
        message: "User tidak ditemukan",
      });

    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {

      return res.status(400).json({
        message: "Password salah",
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({

      token,

      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

exports.changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {

      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });

    }

    if (newPassword.length < 6) {

      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });

    }

    const user = await User.findByPk(
      req.user.id
    );

    if (!user) {

      return res.status(404).json({
        message: "User tidak ditemukan",
      });

    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!validPassword) {

      return res.status(400).json({
        message: "Password lama tidak sesuai",
      });

    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.json({
      message: "Password berhasil diubah",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
