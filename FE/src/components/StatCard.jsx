export default function StatCard({
  title,
  value,
  unit,
}) {
  return (
    <div className="bg-[#0b1220] rounded-3xl p-6 border border-cyan-500/10">
      <h2 className="text-gray-400 mb-3">{title}</h2>

      <h1 className="text-5xl font-bold text-white">
        {value}

        <span className="text-cyan-400 text-2xl ml-2">
          {unit}
        </span>
      </h1>
    </div>
  );
}
