const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const db = require("../models");
const { createLog } = require("../controllers/plcLogController");


router.post("/", authMiddleware, createLog);


router.get("/", authMiddleware, async (req, res) => {
  try {
    const query = {
      order: [["createdAt", "DESC"]],
    };

    if (req.user.role !== "admin") {
      query.where = {
        username: req.user.username,
      };
    }

    const rows = await db.PlcLog.findAll(query);

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
