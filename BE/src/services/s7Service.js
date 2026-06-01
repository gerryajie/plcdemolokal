const snap7 = require("node-snap7");
const net = require("net");

const db = require("../models");

const PLCLog = db.PlcLog;

const plcConfig = {
  plcName:
    process.env.PLC_NAME || "Siemens S7 PLC",
  plcIp:
    process.env.PLC_IP || "192.168.1.10",
  plcRack:
    Number(process.env.PLC_RACK ?? 0),
  plcSlot:
    Number(process.env.PLC_SLOT ?? 1),
  plcPort:
    Number(process.env.PLC_PORT ?? 102),
};

const plcTimeout = {
  ping:
    Number(process.env.PLC_PING_TIMEOUT ?? 3000),
  send:
    Number(process.env.PLC_SEND_TIMEOUT ?? 3000),
  recv:
    Number(process.env.PLC_RECV_TIMEOUT ?? 3000),
};

const plcConnectionType =
  (process.env.PLC_CONNECTION_TYPE || "OP")
    .toUpperCase();

function getConnectionType(targetClient) {

  if (plcConnectionType === "PG") {

    return targetClient.CONNTYPE_PG;

  }

  if (plcConnectionType === "BASIC") {

    return targetClient.CONNTYPE_BASIC;

  }

  return targetClient.CONNTYPE_OP;

}

function getClientError(targetClient) {

  const code =
    targetClient.LastError();

  return {
    code,
    text:
      code
        ? targetClient.ErrorText(code)
        : "No Snap7 error",
  };

}

function checkPlcPort() {

  return new Promise((resolve) => {

    const socket =
      new net.Socket();

    let done = false;

    function finish(ready, reason) {
      if (done) {

        return;

      }

      done = true;

      socket.destroy();

      resolve({
        ready,
        reason,
      });
    }

    socket.setTimeout(plcTimeout.ping);

    socket.once(
      "connect",
      () => finish(true, "connected")
    );

    socket.once(
      "timeout",
      () => finish(false, "timeout")
    );

    socket.once(
      "error",
      (err) => finish(false, err.code || err.message)
    );

    socket.connect(
      plcConfig.plcPort,
      plcConfig.plcIp
    );

  });

}

function createClient() {

  const nextClient =
    new snap7.S7Client();

  nextClient.SetParam(
    nextClient.PingTimeout,
    plcTimeout.ping
  );

  nextClient.SetParam(
    nextClient.SendTimeout,
    plcTimeout.send
  );

  nextClient.SetParam(
    nextClient.RecvTimeout,
    plcTimeout.recv
  );

  nextClient.SetConnectionType(
    getConnectionType(nextClient)
  );

  return nextClient;

}

let client =
  createClient();

const {
  getIO,
  getActiveUsername,
  setPlcStatus,
} = require("../sockets/socket");


let pollingStarted = false;
let reconnectTimer = null;
let connecting = false;
let reading = false;


let previousState = null;

function emitPlcStatus(status) {

  const payload = {
    ...plcConfig,
    status,
    connected:
      status === "connected",
  };

  setPlcStatus(payload);

  try {

    getIO().emit(
      "plc:status",
      payload
    );

  } catch {


  }

}


async function connectPLC() {
  if (connecting) {

    console.log(
      "PLC CONNECT ALREADY IN PROGRESS"
    );

    return;

  }

  if (client.Connected()) {

    emitPlcStatus("connected");

    startPolling();

    return;

  }

  connecting = true;

  console.log(
    "TRY CONNECT PLC..."
  );

  emitPlcStatus("connecting");

  let connected = false;
  const attemptClient =
    client;

  const portCheck =
    await checkPlcPort();

  if (attemptClient !== client) {

    return;

  }

  if (!portCheck.ready) {

    connecting = false;

    console.log(
      `PLC TCP PORT ${plcConfig.plcPort} NOT READY:`,
      portCheck.reason
    );

    emitPlcStatus("disconnected");

    resetClient();

    scheduleReconnect();

    return;

  }

  console.log(
    `PLC TCP PORT ${plcConfig.plcPort} READY`
  );

  try {

    connected =
      attemptClient.ConnectTo(
        plcConfig.plcIp,
        plcConfig.plcRack,
        plcConfig.plcSlot
      );

  } catch (err) {

    connecting = false;

    console.log(
      "CONNECT ERROR:",
      err.message || err
    );

    emitPlcStatus("disconnected");

    resetClient();

    scheduleReconnect();

    return;

  }

  console.log(
    "CONNECT RESULT:",
    connected
  );

  if (!connected) {

    const snap7Error =
      getClientError(attemptClient);

    console.log(
      "CONNECT SNAP7 ERROR:",
      snap7Error.code,
      snap7Error.text
    );

  }

  setTimeout(() => {
    if (attemptClient !== client) {

      return;

    }

    connecting = false;

    console.log(
      "CONNECTED:",
      attemptClient.Connected()
    );


    if (
      !attemptClient.Connected()
    ) {

      console.log(
        "PLC NOT CONNECTED"
      );

      emitPlcStatus("disconnected");

      resetClient();

      scheduleReconnect();

      return;

    }

    console.log(
      "PLC CONNECTED"
    );

    if (reconnectTimer) {

      clearTimeout(reconnectTimer);

      reconnectTimer = null;

    }

    emitPlcStatus("connected");


    startPolling();

  }, 2000);

}


function reconnect() {
  scheduleReconnect();
}


function scheduleReconnect() {
  if (reconnectTimer) {

    return;

  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;

    console.log(
      "RECONNECT PLC..."
    );

    connectPLC();

  }, 5000);

}


function resetClient() {
  try {

    client.Disconnect();

  } catch (err) {

    console.log(
      "PLC DISCONNECT ERROR:",
      err.message || err
    );

  }

  client =
    createClient();

  connecting = false;

  reading = false;
}


function startPolling() {


  if (pollingStarted) {

    console.log(
      "POLLING ALREADY STARTED"
    );

    return;

  }

  pollingStarted = true;

  console.log(
    "START PLC POLLING..."
  );


  setInterval(() => {
    if (reading) {

      return;

    }

    if (!client.Connected()) {

      emitPlcStatus("disconnected");

      if (
        !reconnectTimer &&
        !connecting
      ) {

        resetClient();

      }

      scheduleReconnect();

      return;

    }

    reading = true;
    const readClient =
      client;

    readClient.MBRead(
      10,
      1,

      async (
        err,
        res
      ) => {
        if (readClient !== client) {

          return;

        }

        reading = false;


        if (err) {

          console.log(
            "READ ERROR:",
            readClient.ErrorText(err)
          );

          emitPlcStatus("disconnected");

          resetClient();

          scheduleReconnect();

          return;

        }


        const byte =
          res[0];


        const plcData = {

          ...plcConfig,

          connected:
            readClient.Connected(),

          status:
            "connected",

          startEngine:
            (byte & 1) !== 0,

          batteryLow:
            (byte & 2) !== 0,

          shortCircuit:
            (byte & 4) !== 0,

          timePreventive:
            (byte & 8) !== 0,

        };


        getIO().emit(
          "plc:data",
          plcData
        );


        if (
          previousState === null
        ) {

          previousState = {
            ...plcData,
          };

          console.log(
            "INITIAL PLC STATE SAVED"
          );

          return;

        }


        const changes = [];


        if (

          previousState.startEngine
          !== plcData.startEngine

        ) {

          changes.push({

            username:
              getActiveUsername(),

            message:
              plcData.startEngine

                ? "START ENGINE RUNNING"

                : "START ENGINE STOP",

          });

        }


        if (

          previousState.batteryLow
          !== plcData.batteryLow

        ) {

          changes.push({
            username:
              getActiveUsername(),

            message:
              plcData.batteryLow

                ? "BATTERY LOW DETECTED"

                : "BATTERY NORMAL",

          });

        }


        if (

          previousState.shortCircuit
          !== plcData.shortCircuit

        ) {

          changes.push({

            username:
              getActiveUsername(),

            message:
              plcData.shortCircuit

                ? "SHORT CIRCUIT DETECTED"

                : "SHORT CIRCUIT SAFE",

          });

        }


        if (

          previousState.timePreventive
          !== plcData.timePreventive

        ) {

          changes.push({

            username:
              getActiveUsername(),

            message:
              plcData.timePreventive

                ? "TIME PREVENTIVE ACTIVE"

                : "TIME PREVENTIVE NORMAL",

          });

        }


        if (
          changes.length === 0
        ) {

          return;

        }


        console.log(
          "PLC CHANGED:",
          changes
        );

        for (
          const log of changes
        ) {

          await PLCLog.create(log);

        }


        previousState = {
          ...plcData,
        };

      }

    );

  }, 1000);

}


module.exports = {

  connectPLC,

};
