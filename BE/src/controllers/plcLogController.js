const db = require("../models");

const PlcLog = db.PlcLog;


exports.createLog = async (req, res) => {

  try {

    const {
      username,
      message,
    } = req.body;

    const log = await PlcLog.create({
      username,
      message,
    });

    res.json(log);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


exports.getLogs = async (req, res) => {

  try {

    const logs = await PlcLog.findAll({

      order: [["createdAt", "DESC"]],

    });

    res.json(logs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
