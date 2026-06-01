const PlcLog = require("../models/PlcLog");

const Alert = require("../models/Alert");

const { getIO } = require("../sockets/socket");

function random(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

const machines = [
  {
    id: 1,
    name: "Mixer Machine",
    plcIp: "192.168.1.10",
  },
  {
    id: 2,
    name: "Gerry Machine",
    plcIp: "192.168.1.11",
  },
  {
    id: 3,
    name: "Martin Machine",
    plcIp: "192.168.1.12",
  },
];

module.exports = () => {
  setInterval(async () => {
    for (const machine of machines) {
      const temperature = random(30, 100);

      const pressure = random(1, 10);

      const rpm = random(100, 500);

      const output = random(1000, 5000);

      const status =
        temperature > 90
          ? "WARNING"
          : "RUNNING";

      const plcData = {
        machineId: machine.id,
        machineName: machine.name,
        plcIp: machine.plcIp,
        temperature,
        pressure,
        rpm,
        output,
        status,
      };

      await PlcLog.create(plcData);

      if (temperature > 90) {
        const alert = await Alert.create({
          machineId: machine.id,
          type: "OVERHEAT",
          severity: "HIGH",
          message: `${machine.name} Overheat`,
        });

        getIO().emit("alert", alert);
      }

      if (Math.random() < 0.03) {
        const disconnectAlert =
          await Alert.create({
            machineId: machine.id,
            type: "DISCONNECT",
            severity: "CRITICAL",
            message: `${machine.name} PLC Disconnect`,
          });

        getIO().emit(
          "alert",
          disconnectAlert
        );

        plcData.status = "OFFLINE";
      }

      getIO().emit("plc:data", plcData);
    }
  }, 2000);
};
