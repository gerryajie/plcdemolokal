const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const reportController = require("../controllers/reportController");
const PLCLog = require("../models/PLCLog");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await PLCLog.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get(
  "/excel",
  authMiddleware.adminOnly,
  reportController.exportExcel
);

router.get(
  "/pdf",
  authMiddleware,
  reportController.exportPDF
);

module.exports = router;
