let io;


let activeUsername =
  "system";

let plcStatus =
  null;


const initSocket = (
  socketIO
) => {

  io = socketIO;

  io.on(
    "connection",
    (socket) => {

      console.log(
        "CLIENT CONNECTED"
      );

      if (plcStatus) {

        socket.emit(
          "plc:status",
          plcStatus
        );

      }


      socket.on(
        "user:login",
        (username) => {

          console.log(
            "ACTIVE USER:",
            username
          );

          activeUsername =
            username;

        }
      );


      socket.on(
        "disconnect",
        () => {

          console.log(
            "CLIENT DISCONNECTED"
          );

        }
      );

    }
  );

};


const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );

  }

  return io;

};


const getActiveUsername =
  () => {

    return activeUsername;

  };

const setPlcStatus =
  (status) => {

    plcStatus =
      status;

  };


module.exports = {

  initSocket,

  getIO,

  getActiveUsername,

  setPlcStatus,

};
