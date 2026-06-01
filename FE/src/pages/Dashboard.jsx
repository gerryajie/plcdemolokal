
import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import socket from "../socket/socket";

import {
  Cpu,
  Battery,
  ShieldAlert,
  TimerReset,
  Wifi,
} from "lucide-react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function Dashboard() {


  const [plcData, setPlcData] = useState({
    plcName: "Waiting PLC",
    plcIp: "-",
    plcRack: "-",
    plcSlot: "-",
    connected: false,
    status: "waiting",
    startEngine: false,
    batteryLow: false,
    shortCircuit: false,
    timePreventive: false,
  });


  const [prevData, setPrevData] = useState({
    startEngine: false,
    batteryLow: false,
    shortCircuit: false,
    timePreventive: false,
  });


  const [timeline, setTimeline] = useState([]);


  const [currentTime, setCurrentTime] = useState(
    new Date()
  );


  const username =
    localStorage.getItem("username") || "Operator";


 useEffect(() => {

  const timer =
    setInterval(
      () => setCurrentTime(new Date()),
      1000
    );

  return () => {

    clearInterval(timer);

  };

}, []);

  useEffect(() => {

  const username =
    localStorage.getItem(
      "username"
    );


  if (username) {

    socket.emit(
      "user:login",
      username
    );

    console.log(
      "LOGIN USER:",
      username
    );

  }

}, []);


  useEffect(() => {

    const handlePlcStatus =
      (status) => {

        setPlcData((prev) => ({
          ...prev,
          ...status,
        }));

      };

    const handlePlcData =
      (data) => {

      setPlcData((prev) => ({
        ...prev,
        ...data,
      }));

      let eventMessage = "";


      if (
        data.startEngine !== prevData.startEngine
      ) {

        eventMessage = data.startEngine
          ? "START ENGINE RUNNING"
          : "START ENGINE STOPPED";

      }


      if (
        data.batteryLow !== prevData.batteryLow
      ) {

        eventMessage = data.batteryLow
          ? "BATTERY LOW DETECTED"
          : "BATTERY NORMAL";

      }


      if (
        data.shortCircuit !== prevData.shortCircuit
      ) {

        eventMessage = data.shortCircuit
          ? "SHORT CIRCUIT DETECTED"
          : "SHORT CIRCUIT SAFE";

      }


      if (
        data.timePreventive !== prevData.timePreventive
      ) {

        eventMessage = data.timePreventive
          ? "TIME PREVENTIVE ACTIVE"
          : "TIME PREVENTIVE NORMAL";

      }


      if (eventMessage !== "") {


        setTimeline((prev) => [

          {
            message: eventMessage,
            createdAt: new Date(),
          },

          ...prev,

        ]);



      }

      setPrevData(data);

    };

    socket.on("plc:status", handlePlcStatus);

    socket.on("plc:data", handlePlcData);

    return () => {

      socket.off("plc:status", handlePlcStatus);

      socket.off("plc:data", handlePlcData);

    };

  }, [prevData]);

  return (

    <MainLayout>


      <div
        className="
          mb-6
          flex
          flex-col
          gap-5
          rounded-2xl
          border
          border-white/10
          bg-[linear-gradient(135deg,rgba(8,16,40,0.95),rgba(15,30,62,0.9)_55%,rgba(6,78,59,0.25))]
          p-4
          shadow-2xl
          shadow-black/20
          sm:p-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >


        <div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl xl:text-5xl">

            PLC Monitoring Command Center

          </h1>

          <p className="mt-2 text-base text-gray-400 sm:text-lg">

            Real-time machine status, alarm tracking, and production visibility

          </p>

        </div>


        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-cyan-300/20
              bg-[linear-gradient(135deg,rgba(8,145,178,0.16),rgba(34,197,94,0.10)_48%,rgba(15,23,42,0.48))]
              p-4
              shadow-xl
              shadow-cyan-950/20
              backdrop-blur
              sm:min-w-[320px]
            "
          >

            <div className="mb-3 flex items-start justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
                  <Wifi size={20} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                    Connected PLC
                  </p>

                  <h2 className="truncate text-base font-bold text-white sm:text-lg">

                    {plcData.plcName}

                  </h2>

                </div>

              </div>

              <div
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  ${
                    plcData.connected
                      ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                      : "border-red-300/20 bg-red-400/10 text-red-200"
                  }
                `}
              >

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    plcData.connected
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                  }`}
                />

                {plcData.connected
                  ? "ONLINE"
                  : plcData.status.toUpperCase()}

              </div>

            </div>

            <div className="grid grid-cols-3 gap-2">

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-gray-500">
                  IP
                </p>
                <p className="truncate text-sm font-semibold text-gray-100">
                  {plcData.plcIp}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-gray-500">
                  Rack
                </p>
                <p className="text-sm font-semibold text-gray-100">
                  {plcData.plcRack}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-gray-500">
                  Slot
                </p>
                <p className="text-sm font-semibold text-gray-100">
                  {plcData.plcSlot}
                </p>
              </div>

            </div>

          </div>


          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 shadow-lg sm:px-5">


            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-lg font-bold text-slate-950 sm:h-14 sm:w-14 sm:text-xl">

              {username.charAt(0).toUpperCase()}

            </div>


            <div>

              <p className="text-gray-400 text-sm">

                Hallo

              </p>

              <h1 className="font-bold text-green-400 text-lg">

                {username}

              </h1>

            </div>

          </div>

        </div>

      </div>


      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">

        <StatusCard
          title="START ENGINE"
          value={plcData.startEngine ? "RUNNING" : "STOP"}
          color="text-green-400"
          icon={<Cpu className="text-green-400" />}
        />

        <StatusCard
          title="BATTERY LOW"
          value={plcData.batteryLow ? "LOW" : "NORMAL"}
          color="text-yellow-400"
          icon={<Battery className="text-yellow-400" />}
        />

        <StatusCard
          title="SHORT CIRCUIT"
          value={plcData.shortCircuit ? "DETECTED" : "SAFE"}
          color="text-red-400"
          icon={<ShieldAlert className="text-red-400" />}
        />

        <StatusCard
          title="TIME PREVENTIVE"
          value={plcData.timePreventive ? "ACTIVE" : "NORMAL"}
          color="text-blue-400"
          icon={<TimerReset className="text-blue-400" />}
        />

      </div>


      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">

        <DonutCard
          title="START ENGINE"
          value={plcData.startEngine ? 100 : 0}
          text={plcData.startEngine ? "ON" : "OFF"}
          color="#22c55e"
          label={plcData.startEngine ? "RUNNING" : "STOP"}
        />

        <DonutCard
          title="BATTERY LOW"
          value={plcData.batteryLow ? 100 : 0}
          text={plcData.batteryLow ? "ON" : "OFF"}
          color="#eab308"
          label={plcData.batteryLow ? "LOW" : "NORMAL"}
        />

        <DonutCard
          title="SHORT CIRCUIT"
          value={plcData.shortCircuit ? 100 : 0}
          text={plcData.shortCircuit ? "ON" : "OFF"}
          color="#ef4444"
          label={plcData.shortCircuit ? "FAULT" : "SAFE"}
        />

        <DonutCard
          title="TIME PREVENTIVE"
          value={plcData.timePreventive ? 100 : 0}
          text={plcData.timePreventive ? "ON" : "OFF"}
          color="#3b82f6"
          label={plcData.timePreventive ? "ACTIVE" : "NORMAL"}
        />

      </div>


      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">


        <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,16,40,0.95),rgba(18,25,50,0.88))] p-4 shadow-xl shadow-black/15 sm:p-6">

          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">

            Active Alarm

          </h1>

          <div className="space-y-5">

            {plcData.startEngine && (

              <AlarmCard
                text="START ENGINE RUNNING"
                border="border-green-500"
                dot="bg-green-400"
              />

            )}

            {plcData.batteryLow && (

              <AlarmCard
                text="BATTERY LOW"
                border="border-yellow-500"
                dot="bg-yellow-400"
              />

            )}

            {plcData.shortCircuit && (

              <AlarmCard
                text="SHORT CIRCUIT DETECTED"
                border="border-red-500"
                dot="bg-red-400"
              />

            )}

            {plcData.timePreventive && (

              <AlarmCard
                text="TIME PREVENTIVE ACTIVE"
                border="border-blue-500"
                dot="bg-blue-400"
              />

            )}

          </div>

        </div>


        <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,16,40,0.95),rgba(12,26,52,0.88))] p-4 shadow-xl shadow-black/15 sm:p-6 xl:col-span-2">

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <h1 className="text-2xl font-bold sm:text-3xl">

              Realtime Event Timeline

            </h1>

            <span className="text-green-400 font-bold">

              ● LIVE

            </span>

          </div>

          <div className="max-h-[650px] space-y-4 overflow-auto">

            {timeline.map((item, index) => (

              <TimelineCard
                key={index}
                item={item}
                currentTime={currentTime}
              />

            ))}

          </div>

        </div>

      </div>

    </MainLayout>

  );
}


function StatusCard({
  title,
  value,
  color,
  icon,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,16,40,0.94),rgba(13,26,52,0.88))] p-4 shadow-xl shadow-black/15 sm:p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-400">

            {title}

          </p>

          <h1 className={`mt-3 text-3xl font-bold sm:text-4xl xl:text-5xl ${color}`}>

            {value}

          </h1>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 sm:p-4">

          {icon}

        </div>

      </div>

    </div>

  );
}


function DonutCard({
  title,
  value,
  text,
  color,
  label,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,16,40,0.94),rgba(13,26,52,0.88))] p-4 shadow-xl shadow-black/15 sm:p-6">

      <div className="flex justify-between items-center mb-5">

        <h1 className="text-xl font-bold sm:text-2xl">

          {title}

        </h1>

        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />

      </div>

      <div className="mx-auto h-36 w-36 sm:h-44 sm:w-44 xl:h-48 xl:w-48">

        <CircularProgressbar
          value={value}
          text={text}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: "#1e293b",
          })}
        />

      </div>

      <p
        className="mt-5 text-center text-lg font-bold sm:text-xl"
        style={{ color }}
      >

        {label}

      </p>

    </div>

  );
}


function AlarmCard({
  text,
  border,
  dot,
}) {

  return (

    <div className={`flex items-center justify-between rounded-2xl border bg-white/[0.05] p-4 sm:p-5 ${border}`}>

      <span className="font-bold">

        {text}

      </span>

      <div className={`w-3 h-3 rounded-full ${dot}`} />

    </div>

  );
}


function TimelineCard({
  item,
  currentTime,
}) {

  return (

    <div className="rounded-2xl border border-white/10 border-l-green-400 bg-white/[0.05] p-4 sm:p-5">

      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:justify-between">

        <h1 className="text-lg font-bold sm:text-xl">

          PLC EVENT

        </h1>

        <span className="text-gray-400">

          {currentTime.toLocaleTimeString()}

        </span>

      </div>

      <div className="rounded-xl bg-[#15233f] px-4 py-3 text-base sm:px-5 sm:py-4 sm:text-lg">

        {item.message}

      </div>

    </div>

  );
}
