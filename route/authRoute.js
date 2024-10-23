import express from "express";
import {
  authenticateUser,
  generateToken,
} from "../controller/authController.js";

const router = express.Router();

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);

    if (user) {
      const token = generateToken(user);
      return res.status(200).json({
        message: "Login berhasil",
        data: { token },
        status: 200,
      });
    }
  } catch (err) {
    if (err.errorType === "userNotFound") {
      return res
        .status(404)
        .json({ error: "User tidak ditemukan", status: 404 });
    }
    if (err.errorType === "invalidPassword") {
      return res.status(401).json({ error: "Invalid password", status: 401 });
    }
    return res.status(500).json({ error: "Server error", status: 500 });
  }
});

export default router;
