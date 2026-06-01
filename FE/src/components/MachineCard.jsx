export default function MachineCard({
  machine,
}) {
  const online =
    machine.status !== "OFFLINE";

  return (
    <div className="bg-[#0b1220] rounded-3xl p-6 border border-cyan-500/10 hover:scale-[1.02] transition-all">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {machine.machineName}
          </h1>

          <p className="text-gray-400 text-sm">
            {machine.plcIp}
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-xl text-sm ${
            online
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {online ? "ONLINE" : "OFFLINE"}
        </div>
      </div>

      <div className="space-y-4">
        <Item
          label="Temperature"
          value={`${machine.temperature} °C`}
        />

        <Item
          label="Pressure"
          value={`${machine.pressure} BAR`}
        />

        <Item
          label="RPM"
          value={`${machine.rpm} RPM`}
        />

        <Item
          label="Output"
          value={`${machine.output} PCS`}
        />
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="flex justify-between border-b border-cyan-500/10 pb-2">
      <span className="text-gray-400">
        {label}
      </span>

      <span className="text-white font-semibold">
        {value}
      </span>
    </div>
  );
}
