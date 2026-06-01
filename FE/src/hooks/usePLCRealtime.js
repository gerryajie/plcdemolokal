import { useEffect } from "react";
import socket from "../socket/socket";

export default function usePLCRealtime(callback) {

  useEffect(() => {

    socket.on("plc:data", callback);

    return () => {
      socket.off("plc:data", callback);
    };

  }, [callback]);
}
