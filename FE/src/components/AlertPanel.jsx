export default function AlertPanel({
  alerts,
}) {
  return (
    <div className="bg-[#0b1220] rounded-3xl p-6 border border-red-500/10">
      <h1 className="text-2xl font-bold text-white mb-5">
        Realtime Alert
      </h1>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-red-500/20 border border-red-500/20 rounded-2xl p-4 text-red-300"
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
}
